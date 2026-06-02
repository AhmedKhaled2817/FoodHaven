import { Injectable, inject } from '@angular/core';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { Router, ActivationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { filter } from 'rxjs/operators';

interface SeoRouteData {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private router = inject(Router);

  initialize(): void {
    this.router.events
      .pipe(filter((event): event is ActivationEnd => event instanceof ActivationEnd))
      .subscribe(({ snapshot }) => {
        const data = this.getDeepestRouteData(snapshot) as SeoRouteData;
        const title = data.title ?? 'Food Haven';
        const description =
          data.description ?? 'Premium food delivery experience with smart recommendations and loyalty rewards.';
        const keywords = data.keywords ?? 'food, premium, delivery, meals, loyalty, restaurant';

        this.setTitle(title);
        this.updateMeta({ name: 'description', content: description });
        this.updateMeta({ name: 'keywords', content: keywords });
        if (data.ogImage) {
          this.updateMeta({ property: 'og:image', content: data.ogImage });
        }
      });
  }

  private getDeepestRouteData(snapshot: ActivatedRouteSnapshot): SeoRouteData {
    let data = snapshot.data || {};
    while (snapshot.firstChild) {
      snapshot = snapshot.firstChild;
      data = { ...data, ...snapshot.data };
    }
    return data;
  }

  private setTitle(value: string): void {
    this.title.setTitle(value);
  }

  private updateMeta(tag: MetaDefinition): void {
    this.meta.updateTag(tag);
  }
}
