import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {HttpParams, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';
import * as AWS from "aws-sdk";

import {SigV4Client} from '../../libs/sigV4client';

interface DataResponse {
  name: string;
  address: string;
  phone: string;
}

interface UserData {
  email: string;
  name: string;
  address: string;
  phone: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HttpClient Methods Demo';
  deleteUrl = 'https://s3vroh73rl.execute-api.us-east-1.amazonaws.com/dev';
  putUrl = 'https://s3vroh73rl.execute-api.us-east-1.amazonaws.com/dev';
  patchUrl = 'https://s3vroh73rl.execute-api.us-east-1.amazonaws.com/dev';
  postUrl = 'https://s3vroh73rl.execute-api.us-east-1.amazonaws.com/dev';
  getUrl = 'https://r9h4zrkl93.execute-api.us-east-1.amazonaws.com/dev';
  endpoint = 'https://s3vroh73rl.execute-api.us-east-1.amazonaws.com/dev';
  region = "us-east-1";
  accessKey = "";
  secretKey: "";
  sessionToken = "";



  getResult: any = {};
  postResult: any = {};
  deleteResult: any = {};
  putResult: any = {};
  patchResult: any = {};
  error: string;
  payload: any = {name: 'steve', address: 'orange, CT', phone: '203-214-5049'};
  headers = new HttpHeaders().set("content-type", "application/json");

    constructor(private http: HttpClient) {
  }

  doGet() {
    let params = new HttpParams().set("email", "steve@angularorange.io");
    this.http.get(this.getUrl, {params}).subscribe(
      res => { this.getResult = res},
      err => {console.log("Error occurred: " + err.message);}
    );
  }

  doPost() {

    this.http.post(this.postUrl, this.payload,  {
      headers: new HttpHeaders().set("content-type", "application/json")
    }).subscribe(
      res => this.postResult = res,
      err => {console.log("Error occurred: " + err.message);}
    );
  }

  doPatch() {

    const req = this.http.patch(this.patchUrl, {
        phone: '212-867-5309'
      }).subscribe(res => {
                               console.log(`PATCH called successful modified attribute returned: ` + res);
                               this.patchResult = res;
                          },
      err => {
        console.log("PATCH call failed error: " + err.message)
      });
  }

  doPut() {
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    const req = this.http.put(this.putUrl, {
      name: 'steve',
      address: 'orange, CT',
      phone: '203-877-0098'
    }, {headers}).subscribe(res => {
                                    console.log("PUT call successful value returned: " + res);
                                    this.putResult = res;
                                    },
        err => {
          console.log("PUT call failed error: " + err.message)
        }
    );
  }

  doDelete() {

    const req = this.http.delete(this.deleteUrl, this.payload).subscribe(
      res => {console.log('DELETE successful: ', res);
        this.deleteResult = res;},
      err =>
        console.log("DELETE failed: " + err.message),
      () => console.log("The DELETE observable has completed.")
    );
  }

  doAuthCall(){

    let sigV4Client = new SigV4Client({
      // Your AWS temporary access key
      accessKEy : this.accessKey,
      // Your AWS temporary secret key
      secretKey: this.secretKey,
      // Your AWS temporary session token
      sessionToken: this.sessionToken,
      // API Gateway region
      region: this.region,
      // API Gateway URL
      endpoint: this.endpoint
    });

    const signedRequest = client.signRequest({
      // The HTTP method
      method,
      // The request path
      path,
      // The request headers
      headers,
      // The request query parameters
      queryParams,
      // The request body
      body
    });
  }


}

export async function invokeApig({
                                   path,
                                   method = "GET",
                                   headers = {},
                                   queryParams = {},
                                   body
                                 }) {
  if (!await authUser()) {
    throw new Error("User is not logged in");
  }

  const signedRequest = sigV4Client
    .newClient({
      accessKey: AWS.config.credentials.accessKeyId,
      secretKey: AWS.config.credentials.secretAccessKey,
      sessionToken: AWS.config.credentials.sessionToken,
      region: config.apiGateway.REGION,
      endpoint: config.apiGateway.URL
    })
    .signRequest({
      method,
      path,
      headers,
      queryParams,
      body
    });

  body = body ? JSON.stringify(body) : body;
  headers = signedRequest.headers;

  const results = await fetch(signedRequest.url, {
    method,
    headers,
    body
  });

  if (results.status !== 200) {
    throw new Error(await results.text());
  }

  return results.json();
}
//https://serverless-stack.com/chapters/connect-to-api-gateway-with-iam-auth.html
