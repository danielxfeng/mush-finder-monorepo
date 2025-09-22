**Don’t expect too much just yet**
MushFinder is still an early test version. The hardest part is getting a result with enough confidence, because:
- Mushrooms are confusing by nature, and sometimes it’s difficult to identify them from just a picture.
- It’s also tricky for users to take a clear photo in the wild. Mushrooms are small and often hidden in grass, and for example, once you take them home, clean them, and snap a picture, they may already look quite different from the training examples. 😄
- **As a result, confident predictions are not always possible**

But I still wanted to put it out there as my very first machine learning project.
And honestly, with a decent photo it can perform quite well. 
The deployment itself was also interesting I guess, so I thought it would be fun to share.

Mushroom picking is a popular activity in Finland. However, for many foreigners like me, identifying the right mushrooms in the forest can be confusing.

MushFinder is an experimental tool I built to help users get a rough suggestion of what kind of mushroom they're seeing (not to determine if it's edible), based on a photo taken with their phone. It's powered by a custom CNN model and focuses specifically on mushrooms commonly found in Finnish forests.

![mush-finder](https://github.com/danielxfeng/blog-content/blob/main/media/Mushfinder/mushfinder.cover.jpg?raw=true)

Try it for fun: [https://mush.danielslab.dev](https://mush.danielslab.dev)
(Try to take a picture of the whole mushroom in its natural environment, keep it centered, and show both the cap and the stem, if possible (Yep, I know it's very difficult). You don’t need a high-end camera, clarity matters more than resolution.)

---

## ✨ Challenges, Solutions, and Issues

### 🧠 Machine Learning
- **Class selection**
At the beginning, I ambitiously tried to train the model on nearly **200 mushroom species**.
Unsurprisingly, the accuracy was poor. Many of those species were both **rare (very few samples available)** and **highly similar to each other**, which made it almost impossible for the model to learn meaningful distinctions.
So I narrowed it down to 20 of the most common species, where data availability was better and inter-class differences clearer.
- **Model architecture**  
I experimented with different architectures and finally settled on the **Facebook ConvNeXt series**, applied through **transfer learning in PyTorch**.
It gave me the **highest validation accuracy** while also keeping the **model size small enough** to be practical for deployment, especially important for the offline Edge ML version. 
- **Hyperparameter tuning**  
Initially I tuned everything manually, which was slow and tedious.  
Later I switched to **Optuna** for automated hyperparameter search, exploring parameters such as learning rate, weight decay, batch size, and augmentation strength.  
This broader search space helped speed up experiments and gave more consistent results.
- **Loss function design**  
I also experimented with adding a “toxic vs. edible” label as an auxiliary task.  
However, backpropagating this loss did not significantly reduce the most critical error: predicting a toxic mushroom as edible.  
While overall accuracy sometimes improved, the toxic misclassification rate also decreased, and when the auxiliary loss weight was set too high, the overall accuracy dropped sharply. The trade-off was simply too costly.  
As a result, I chose to use the label only in the forward pass rather than as a training signal. 
- **Real-world lesson**  
I learned that accuracy alone is not enough. In deployment, a top-1 prediction with very low confidence is practically useless. Many real photos failed to meet a “trustworthy” threshold, which was an important takeaway for me.

### 🗂️ Project Management
- This was my first time setting up a **monorepo with Turborepo**, which includes:  
  - a **frontend** (React + Progressive Web App(PWA)),  
  - an **API gateway** (TypeScript, running on Cloudflare Workers as Serverless functions), and  
  - a **Python inference workers** (running on Hugging Face Spaces).  
- Shared code was also interesting: I used **Zod** to define schemas, generated JSON Schema, and reused it across frontend (validation), API gateway, and Python backend (via Pydantic). This kept everything consistent and reduced bugs.

### 💻 Frontend
- I built MushFinder as a **Progressive Web App (PWA)** so that it can be installed like a native app and run offline.  
- On the client side, I integrated **ONNX-Runtime Web** to run inference directly in the browser. This means users can still get predictions even without internet access.  
- For offline persistence, I used **IndexedDB** to store both images and inference results, so users can revisit past identifications even when they’re offline.  
- The UI is optimized for **mobile-first usage**, since most people will be taking photos directly with their phones in the forest. Small touches like history tracking, disclaimer pop-ups, and a lightweight design help keep it simple and approachable.

### ⚙️ Backend
- The backend is structured as a **distributed inference system**:  
  - **API Gateway**: A lightweight service deployed on **Cloudflare Workers**, handling routing, validation, and coordination. Being serverless, it scales easily and requires minimal maintenance.  
  - **Task Queue / Cache**: I used **Upstash Redis** for distributed task management and caching. This makes it easier to handle concurrent requests and ensures results can be returned quickly.  
  - **Inference Worker**: The heavy lifting happens on **Hugging Face Spaces**, where the PyTorch model runs in a CPU container. This way I didn’t need to manage servers myself, and I could iterate faster.  
- Together, this architecture allowed me to combine **serverless scalability** with **flexibility for experimentation**.
- By design, the Frontend checks results after about 3 seconds. In my tests, even with 20 concurrent requests, all results were ready by the first check. So for this level of usage, the system is already sufficient, although I haven’t yet stress-tested it at larger scales.
