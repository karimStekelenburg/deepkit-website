import { Component } from '@angular/core';

@Component({
    template: `
        <div class="subline">Framework</div>

        <h2>HTTP controller</h2>

        <p>
            A HTTP controller is one of three entry points to your application. A HTTP controller defines HTTP routes using TypeScript
            classes and decorators.
        </p>

        <p>
            A very simple implementation of a HTTP controller looks like the following:
        </p>

        <textarea codeHighlight title="app.ts">
            #!/usr/bin/env ts-node-script
            import 'reflect-metadata';
            import { Application } from '@deepkit/framework';
            import { http } from '@deepkit/http';
            
            @http.controller('my-base-url/')
            class MyPage {
                @http.GET('hello-world')
                helloWorld() {
                    return "Hello World!";
                }
            }
            
            Application.create({
                controllers: [MyPage],
            }).run();
        </textarea>

        <p>
            You can execute that script directly with <code>ts-node</code>.
        </p>

        <textarea codeHighlight="bash">
            $ ts-node app.ts server:listen
            2021-06-11T17:44:52.646Z [LOG] Start HTTP server, using 1 workers.
            2021-06-11T17:44:52.649Z [LOG] HTTP MyPage
            2021-06-11T17:44:52.649Z [LOG]     GET /my-base-url/hello-world helloWorld
            2021-06-11T17:44:52.649Z [LOG] HTTP listening at http://localhost:8080/
        </textarea>

        <p>
            Request your first route with curl returns your returned string.
        </p>

        <textarea codeHighlight="bash">
            $ curl http://localhost:8080/my-base-url/hello-world
            Hello World!
        </textarea>

        <p>
            HTTP controllers are handled and instantiated by the dependency injection container, like services and event listeners, and have thus access
            to all other registered services.
            See the chapter <a routerLink="/documentation/framework/dependency-injection">Dependency injection</a> for more details.
        </p>

        <h3>Decorators</h3>

        <p>
            Each class needs at least the <code>@http.controller</code> decorator and each route at least one HTTP method decorator.
            Decorators on routes (methods) can be chains, for example:
        </p>

        <textarea codeHighlight>
            @http.GET('/user').name('users').description('Lists users')
            userList() {
            }
        </textarea>

        <table class="pretty">
            <tr>
                <th style="width:250px;">Decorator</th>
                <th>Description</th>
            </tr>
            <tr>
                <td>@http.controller(string)</td>
                <td>Marks a class as controller with a baseUrl.</td>
            </tr>
            <tr>
                <td>@http.name(string)</td>
                <td>Assigns a unique name to this route.</td>
            </tr>
            <tr>
                <td>@http.GET(string)</td>
                <td>Marks a method as HTTP GET route with a path pattern.</td>
            </tr>
            <tr>
                <td>@http.POST(string)</td>
                <td>Marks a method as HTTP POST route with a path pattern.</td>
            </tr>
            <tr>
                <td>@http.PUT(string)</td>
                <td>Marks a method as HTTP PUT route with a path pattern.</td>
            </tr>
            <tr>
                <td>@http.DELETE(string)</td>
                <td>Marks a method as HTTP DELETE route with a path pattern.</td>
            </tr>
            <tr>
                <td>@http.ANY(string)</td>
                <td>Marks a method as any HTTP method route with a path pattern.</td>
            </tr>
            <tr>
                <td>@http.throws(ClassType, string)</td>
                <td>Annotates possible error classes that can be thrown by this class.</td>
            </tr>
            <tr>
                <td>@http.regexp(string, RegExp)</td>
                <td>Specifies the regular expression for a route parameter.</td>
            </tr>
            <tr>
                <td>@http.group(...string)</td>
                <td>Assigns this route to a specific group/s.</td>
            </tr>
            <tr>
                <td>@http.category(string)</td>
                <td>Assigns this route to a category.</td>
            </tr>
            <tr>
                <td>@http.data(string, any)</td>
                <td>Assigns arbitrary data to this route.</td>
            </tr>
            <tr>
                <td>@http.description(string)</td>
                <td>Assigns a description to this route.</td>
            </tr>
            <tr>
                <td>@http.use(Function)</td>
                <td>Allows to change the route object and composite multiple properties into one function.</td>
            </tr>
            <tr>
                <td>@http.query()</td>
                <td>Marks a route parameter as query parameter.</td>
            </tr>
            <tr>
                <td>@http.query().optional</td>
                <td>Marks a route parameter as optional</td>
            </tr>
            <tr>
                <td>@http.queries()</td>
                <td>Marks a route parameter as a type of all query parameters.</td>
            </tr>
        </table>

        <h3>Parameters</h3>

        <p>
            Routes can have arbitrary parameters. Path parameters are expressed in the route's path and query as well as body parameters in
            the method signature itself. Path parameter's name map directly to method arguments with the same name.
        </p>

        
        <h4>Path parameters</h4>
        
        <textarea codeHighlight>
            @http.controller('my-base-url/')
            class MyPage {
                @http.GET('hello-world/:text')
                helloWorld(text: string) {
                    return 'Hello ' + text;
                }
            }
        </textarea>

        <textarea codeHighlight="bash">
            $ curl http://localhost:8080/my-base-url/hello-world/galaxy
            Hello galaxy
        </textarea>
        
        <p>
            You can modify how a path parameter is matched using <code>@t.regexp(name, regex)</code>.
        </p>

        <textarea codeHighlight>
            @http.GET('hello-world/:text').regexp('text', /a-zA-Z0-9/)
            helloWorld(text: string) {
                return 'Hello ' + text;
            }
        </textarea>
        
        <h4>Query parameters</h4>
        
        <textarea codeHighlight>
            @http.controller('my-base-url/')
            class MyPage {
                @http.GET('hello-world')
                helloWorld(@http.query() text: string) {
                    return 'Hello ' + text;
                }
            }
        </textarea>

        <textarea codeHighlight="bash">
            $ curl http://localhost:8080/my-base-url/hello-world\\?text\\=galaxy
            Hello galaxy
        </textarea>

        <p>
            Warning: Parameters are not escaped/sanitized. Returning them directly in a string opens a security hole (XSS).
            Make sure to never trust external input and filter/sanitize/convert where necessary.
        </p>
        
        <p>
            Per default query parameters are required.<br/> 
            To make them optional, use <code>@http.query().optional text: string</code>.<br/>
            To remap a parameter name use <code>@http.query('incomingName') text: string</code>.
        </p>
        
        <h4>Query parameters model</h4>
        
        <p>
            Instead of specifying each query parameter as method parameter, you can use a class schema instead.
        </p>
        
        <textarea codeHighlight>
        class HelloWordQuery {
            @t.required text!: string;
        }
        
        @http.controller('my-base-url/')
        class MyPage {
            @http.GET('hello-world')
            helloWorld(@http.queries() query: HelloWordQuery) {
                return 'Hello ' + query.text;
            }
        }
        </textarea>
        
        <h4>Body parameters</h4>
        
        <p>
            For <code>@http.POST</code> routes, you can specify a body schema that is automatically deserialized from the incoming HTTP body.
            The body content type needs to be either <code>application/x-www-form-urlencoded</code>, <code>multipart/form-data</code>,
            or <code>application/json</code>.
        </p>
        
        <textarea codeHighlight>
            class HelloWordBody {
                @t.required text!: string;
            }
            
            @http.controller('my-base-url/')
            class MyPage {
                @http.POST('hello-world')
                helloWorld(@http.body() body: HelloWordBody) {
                    return 'Hello ' + body.text;
                }
            }
        </textarea>
        
        <textarea codeHighlight="bash">
            $ curl http://localhost:8080/my-base-url/hello-world -H "Content-Type: application/json" --data '{"text": "galaxy"}'
            Hello galaxy
        </textarea>
        
        <p>
            To react on body validation errors in the same route, you can include the service <code>BodyValidation</code>.
        </p>
        
        <textarea codeHighlight>
            @http.POST('hello-world')
            helloWorld(bodyValidation: BodyValidation, @http.body() body: HelloWordBody) {
                if (bodyValidation.hasErrors()) {
                    //We got errors.
                    const textError = bodyValidation.getErrorMessageForPath('text');
                    return 'Text is invalid, please fix it. ' + textError;
                }
        
                return 'Hello ' + body.text;
            }
        </textarea>
        
        <p>
            As soon as <code>hasErrors()</code> returns true the injected body representation <code>body</code> can be in faulty state
            when the validation fails. When you don't inject <code>BodyValidation</code> and a faulty request the whole route would return a error
            and your route code would never execute. Use <code>BodyValidation</code> only when you want to for example display error messages 
            regarding the body manually in the same route.
        </p>

        <p>
            To accept uploaded files from HTML forms for example, you should use <code>UploadedFile</code>. 
        </p>
        
        <textarea codeHighlight>
            import { http, UploadedFile } from '@deepkit/http';
            import { readFileSync } from 'fs';

            class HelloWordBody {
                @t.required file!: UploadedFile;
            }

            @http.controller('my-base-url/')
            class MyPage {
                @http.POST('hello-world')
                helloWorld(@http.body() body: HelloWordBody) {
                    const content = readFileSync(body.file.path);

                    return {
                        uploadedFile: body.file
                    };
                }
            }
        </textarea>
        
        <textarea codeHighlight="bash">
            $ curl http://localhost:8080/my-base-url/hello-world -X POST -H "Content-Type: multipart/form-data" -F "file=@Downloads/23931.png"
            {
                "uploadedFile": {
                    "size":6430,
                    "path":"/var/folders/pn/40jxd3dj0fg957gqv_nhz5dw0000gn/T/upload_dd0c7241133326bf6afddc233e34affa",
                    "name":"23931.png",
                    "type":"image/png",
                    "lastModifiedDate":"2021-06-11T19:19:14.775Z"
                }
            }
        </textarea>
        
        <p>
            The router per default stores all uploaded files in the temp folder and will be removed as soon as your route method
            is finished.
        </p>
        
        <h3>Parameter validation/conversion</h3>

        <p>
            Parameters are automatically converted to the annotated type and validated.
            When a complex type is given like union, arrays, etc you have to specify the type via <code>@t</code>.
            See <a routerLink="/documentation/type/schema">Deepkit Type Schema</a> chapter for more information.
        </p>
    `
})
export class DocFrameworkHttpControllerComponent {
}