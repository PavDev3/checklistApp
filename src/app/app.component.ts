import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: [],
})
export class AppComponent  implements OnInit {
  private http = inject(HttpClient);

  ngOnInit() {
    this.http.get('http://localhost:3000/').subscribe((res) => 
      console.log(res)
    );

    const guess = { guess: 14 };

    this.http.post('http://localhost:3000/', guess).subscribe((res) =>
      console.log(res)
    );
  }



}
