import { Directive,Input,OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[appRedirect]'
})
export class RedirectDirective implements OnInit {
  @Input() route: string='/' ;

  constructor(private router: Router) { 
  }
  ngOnInit() {
    this.router.navigate([this.route]);
  }

}
