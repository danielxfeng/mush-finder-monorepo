import { useState } from 'react';

import CtaBtn from '@/components/shared/CtaBtn';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import useDisclaimerStore from '@/lib/stores/disclaimer-store';

const Disclaimer = () => {
  return (
    <section className='flex w-full max-w-prose flex-col items-center gap-3 px-1.5 text-start text-xs lg:text-sm'>
      <p className='rounded border-l-4 border-yellow-400 bg-yellow-50 p-2 dark:border-yellow-500 dark:bg-orange-800/60'>
        ⚠️ Results are <span className='font-bold'>for reference only</span> and does{' '}
        <span className='font-bold'>NOT</span> indicate whether a mushroom is safe to eat.
      </p>
      <p className='rounded border-l-4 border-yellow-400 bg-yellow-50 p-2 dark:border-orange-500 dark:bg-orange-800/60'>
        ☠️ <span className='font-bold'>Never eat wild mushrooms</span> based on this tool. This is
        an <span className='font-bold'>experimental</span> project provided{' '}
        <span className='font-bold'>“as is”</span>, without warranty or responsibility for
        consequences.
      </p>
    </section>
  );
};

interface ConsentDialogProps {
  setConsent: (value: boolean) => void;
}

const ConsentDialog = ({ setConsent }: ConsentDialogProps) => {
  const { skipDisclaimer, setSkipDisclaimer } = useDisclaimerStore();
  const [skipDisclaimerChecked, setSkipDisclaimerChecked] = useState(skipDisclaimer);
  const handleConsent = (accepted: boolean) => {
    setConsent(accepted);
    if (accepted && skipDisclaimerChecked) {
      setSkipDisclaimer(true);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <CtaBtn>Start</CtaBtn>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>⚠️ Disclaimer</DialogTitle>
          <DialogDescription className='flex flex-col gap-3'>
            <Disclaimer />
            <p className='text-muted-foreground text-start text-xs lg:text-sm'>
              By clicking <span className='font-medium'>Continue</span>, you confirm that you have
              read and accepted the disclaimer and agree to our{' '}
              <a href='/terms' target='_blank' rel='noopener noreferrer'>
                Terms and Conditions, and Privacy Policy
              </a>
              .
            </p>
            <div className='flex items-center gap-2'>
              <Checkbox
                id='remember'
                checked={skipDisclaimerChecked}
                onCheckedChange={(val) => {
                  setSkipDisclaimerChecked(val === true);
                }}
              />
              <Label htmlFor='remember' className='text-start text-xs lg:text-sm'>
                Remember my choice and skip this in the future
              </Label>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant='outline'
              onClick={() => {
                handleConsent(false);
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={() => {
                handleConsent(true);
              }}
            >
              Continue
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConsentDialog;
