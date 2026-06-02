import { Directive, ElementRef, HostBinding, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHoverGlow]',
  standalone: true,
})
export class HoverGlowDirective {
  @Input('appHoverGlow') glowColor = 'rgba(255, 107, 53, 0.24)';

  @HostBinding('style.transition') transition = 'transform 0.25s ease, box-shadow 0.25s ease';
  @HostBinding('style.transform') transform = 'translateY(0)';
  @HostBinding('style.boxShadow') boxShadow = '0 24px 60px rgba(0, 0, 0, 0.08)';

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.elementRef.nativeElement, 'will-change', 'transform, box-shadow');
  }

  @HostListener('mouseenter') onMouseEnter(): void {
    this.transform = 'translateY(-6px) scale(1.01)';
    this.boxShadow = `0 36px 90px ${this.glowColor}`;
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.transform = 'translateY(0)';
    this.boxShadow = '0 24px 60px rgba(0, 0, 0, 0.08)';
  }
}
