import { toast, toasts } from '$lib/stores/toast';

export async function withToast<T>(
  action: () => Promise<T>,
  messages: { loading?: string; success: string; error: string }
): Promise<T | undefined> {
  let dismiss: (() => void) | undefined;
  try {
    if (messages.loading) {
      const id = toast.info(messages.loading);
      dismiss = () => toasts.dismiss(id);
    }
    const result = await action();
    dismiss?.();
    toast.success(messages.success);
    return result;
  } catch (err) {
    dismiss?.();
    toast.error(messages.error);
    return undefined;
  }
}


