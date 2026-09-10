import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ModeService } from './mode.service';

export const modeGuard: CanActivateFn = (route, state) => {
  const modeService = inject(ModeService);
  const router = inject(Router);
  
  const currentMode = modeService.currentMode();
  
  // If they have a mode selected, redirect them to that mode's root instead of landing page
  if (currentMode) {
    return router.parseUrl(`/${currentMode}`);
  }
  
  return true;
};
