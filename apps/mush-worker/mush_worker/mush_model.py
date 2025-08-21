import sys
from pathlib import Path

import sentry_sdk
import timm
import torch
import torchvision.transforms as transforms
from PIL import Image

from mush_finder.schemas import TaskResponse, TaskResult, TaskStatus
from mush_finder.settings import settings

CLASS_NAMES = sorted(
    [
        "Lactarius trivialis",
        "Leccinum albostipitatum",
        "Amanita spp.",
        "Boletus edulis",
        "Russula spp.",
        "Suillus granulatus",
        "Lactarius rufus",
        "Suillus variegatus",
        "Cantharellus cibarius",
        "Leccinum versipelle",
        "Lactarius deliciosus group",
        "Craterellus cornucopioides",
        "Inocybe spp.",
        "Amanita muscaria",
        "Tylopilus felleus",
        "Coprinus comatus",
        "Craterellus tubaeformis",
        "Hygrophoropsis aurantiaca",
        "Amanita virosa",
        "Suillus luteus",
    ]
)

IMG_SIZE = (224, 224)


class MushModel:
    def __init__(self) -> None:
        torch.set_num_threads(1)
        torch.set_num_interop_threads(1)

        self.device = torch.device("cpu")
        self.is_warmup = False

        try:
            self.model = timm.create_model(settings.model_url, pretrained=True)
            self.model.to(self.device)
            self.model.eval()
        except Exception as e:
            raise RuntimeError(f"Failed to load model from HF Hub: {e}")

        self.transform = transforms.Compose(
            [
                transforms.ToTensor(),
                transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
            ]
        )

    def warmup(self) -> None:
        if self.is_warmup:
            return
        with torch.inference_mode():
            dummy = torch.zeros(1, 3, *IMG_SIZE).to(self.device)
            _ = self.model(dummy)
        self.is_warmup = True

    def predict(self, image: Image.Image, p_hash: str) -> TaskResponse:
        try:
            if image.size != IMG_SIZE:
                raise ValueError(f"Image size must be {IMG_SIZE}, but got {image.size}")

            if image.mode != "RGB":
                image = image.convert("RGB")

            img_tensor = self.transform(image).unsqueeze(0).to(self.device)  # (1, 3, 224, 224)

            with torch.inference_mode():
                logits = self.model(img_tensor)
                probs = torch.softmax(logits, dim=1)

                values, indices = torch.topk(probs, k=3, dim=1)

                top_probs: list[float] = values[0].tolist()
                top_idx: list[int] = indices[0].tolist()

            results = [TaskResult(category=CLASS_NAMES[i], confidence=float(p)) for i, p in zip(top_idx, top_probs)]

            return TaskResponse(p_hash=p_hash, status=TaskStatus.done, result=results)
        except Exception as e:
            sentry_sdk.capture_exception(e)
            return TaskResponse(p_hash=p_hash, status=TaskStatus.error, result=[])


mush_model = MushModel()

# for local testing
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_local.py <image_path>")
        sys.exit(1)

    img_path = Path(sys.argv[1])
    if not img_path.exists():
        print(f"Error: file not found: {img_path}")
        sys.exit(1)

    try:
        img = Image.open(img_path).convert("RGB").resize(IMG_SIZE, Image.Resampling.BILINEAR)

    except Exception:
        print(f"Error processing image: {img_path}")
        sys.exit(1)

    resp = mush_model.predict(img, "a" * 64)  # bypass the p_hash validation

    if resp.status != TaskStatus.done or not resp.result:
        print("Inference failed.")
        sys.exit(2)

    print("Top-3 predictions:")
    for res in resp.result:
        print(f"  {res.category:30s} {res.confidence * 100:.2f}%")

__all__ = ["mush_model"]
