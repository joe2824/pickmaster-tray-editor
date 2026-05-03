class ToastState {
  message = $state('');
  visible = $state(false);
  private timer: ReturnType<typeof setTimeout> | null = null;

  show(msg: string, ms = 2500) {
    this.message = msg;
    this.visible = true;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.visible = false;
    }, ms);
  }
}

export const toast = new ToastState();
