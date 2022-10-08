import { Component, OnInit, Input } from '@angular/core';
import * as Realm from "realm-web";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  @Input() item = ''; 
  username: string
  password: string
  user: any
  loginResults: any
  userId: any = null
  loggedIn = false
  constructor() { }

  ngOnInit(): void {
    this.onStart()
  }

  async onStart(){
    const app = new Realm.App({ id: "application-0-yprqw" });
    const credentials = Realm.Credentials.anonymous();
    try {
      this.user = await app.logIn(credentials);
    } catch(err) {
      console.error("Error", err);
    }
  }

  async login(){
    const loginResults = await this.user.functions['verifyLogin'](this.username, this.password)
    console.log(loginResults)
    if(loginResults.length!=0){
        this.userId = loginResults[0].id
        this.loggedIn = true
    }
  }

  logOut(){
    this.loggedIn = false
    this.userId = null
  }

}

