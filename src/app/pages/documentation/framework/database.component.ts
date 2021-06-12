import { Component } from '@angular/core';

@Component({
    template: `
        <div class="subline">Framework</div>

        <h2>Database</h2>

        <p>
            Deepkit comes with its own high performance database abstraction library called Deepkit ORM.
            It's an ORM (object–relational mapping) library that makes it easy to work with SQL database as well as MongoDB.
        </p>

        <p>
            Although you can use whatever database library you want, we recommend Deepkit ORM as its the fastest TypeScript database
            abstraction library that is perfectly integrated into the Deepkit Framework and has a lot of features that improve your
            workflow and efficiency.
        </p>

        <p>
            To get all information about Deepkit ORM, please open the chapter <a routerLink="/documentation/orm">Deepkit ORM</a>.
        </p>

        <h3>Model</h3>

        <p>
            In order to read and write data from and to the database, you need to create a model describing the interface and metadata
            of the model. It refers usually directly to the structure of a SQL table or MongoDB collection.
        </p>

        <textarea codeHighlight>
            import { entity, t } from '@deepkit/type';
                        
            @entity.name('user')
            class User {
                @t.primary.autoIncrement id: number = 0;
                
                @t created: Date = new Date;
                
                constructor(@t public username: string) {
                }
            }
        </textarea>

        <p>
            This is how a model aka entity looks like. Your define its name (which is per default its table or collection name) using
            <code>@entity.name()</code> and then annotate each property with <code>@t</code>. See the chapter
            <a routerLink="/documentation/type/schema">Deepkit Type: Schema</a> for more information on how to decorate your class.
        </p>

        <p>
            You can write your schema also in a functional approach.
        </p>

        <textarea codeHighlight>
            import { t } from '@deepkit/type';
            
            const userSchema = t.schema({
                id: t.primary.autoIncrement.default(0),
                created: t.date.default(() => new Date),
                username: t.string,
            }, {name: 'User', collectionName: 'user'});
            type User = InstanceType<typeof userSchema.classType>;
        </textarea>
        
        <h3>Database class</h3>
        
        <p>
            In order to use the created model, you have to specify a data source. This is done using classes extending 
            the <code>Database</code> class of <code>@deepkit/orm</code> and using adapters. 
            Currently MySQL, SQLite, PostgreSQL, and MongoDB are supported, each has its own adapter.
            We use in this example SQLite and <code>@deepkit/sqlite</code>. Luckily, those dependencies are already installed with
            the Deepkit Framework since it uses SQLite under the hood for its debugger storage.
        </p>
        
        <textarea codeHighlight>
            import { Database } from '@deepkit/orm';
            import { SQLiteDatabaseAdapter } from '@deepkit/sqlite';
            
            export class SQLiteDatabase extends Database {
                name = 'default';
                constructor() {
                    super(new SQLiteDatabaseAdapter('/tmp/myapp.sqlite'), [User]);
                }
            }
        </textarea>
        
        <p>
            You create new class you name however you like and specify in its constructor the adapter with its parameters,
            and add all entities aka models that should be associated with that database to the second parameter.
        </p>
        
        <p>
            You can now register this database class in the KernelModule. It makes sure that you can use it
            with the migration function and other utilities like the ORM Browser. We also enable <code>migrateOnStartup</code>,
            which creates all tables in our database automatically on bootstrap. Note that you should <strong>not</strong> use this feature
            for a serious project or production setup.
        </p>
        
        <p>
            We furthermore enable <code>debug</code> which allows us to open the debugger when the application's server is started
            and manage our database models directly in its integrated ORM Browser.
        </p>
        
        <textarea codeHighlight>
            Application.create({,
                imports: [
                    KernelModule.configure({
                        databases: [SQLiteDatabase],
                        migrateOnStartup: true,
                        debug: true,
                    })
                ]
            }).run();
        </textarea>
        
        <h3>Manage data</h3>
        
        <p>
            You have everything setup to be able to manage your database data now using the Deepkit ORM Browser. 
            
            In order to open the ORM Browser and manage the content, write all the steps from above into the <code>app.ts</code> file:
        </p>
        
        
        <p>
            And start the server: 
        </p>
        
        <textarea codeHighlight="bash">
            $ ts-node app.ts server:listen
            2021-06-11T15:08:54.330Z [LOG] Start HTTP server, using 1 workers.
            2021-06-11T15:08:54.333Z [LOG] Migrate database default
            2021-06-11T15:08:54.336Z [LOG] RPC DebugController deepkit/debug/controller
            2021-06-11T15:08:54.337Z [LOG] RPC OrmBrowserController orm-browser/controller
            2021-06-11T15:08:54.337Z [LOG] HTTP OrmBrowserController
            2021-06-11T15:08:54.337Z [LOG]     GET /_orm-browser/query httpQuery
            2021-06-11T15:08:54.337Z [LOG] HTTP StaticController
            2021-06-11T15:08:54.337Z [LOG]     GET /_debug/:any serviceApp
            2021-06-11T15:08:54.337Z [LOG] HTTP listening at http://localhost:8080/
        </textarea>
        
        <p>
            You can now open <a target="_blank" href="http://localhost:8080/_debug/database/default">http://localhost:8080/_debug/database/default</a>.
        </p>
        
        <img src="/assets/documentation/framework/debugger-database.png"/>
        
        <p>
            You can see the ER diagram. At the moment only one entity is available. If you add more with relations you see 
            all those information at one glance.
        </p>
        
        <p>
            When you click on "User" in the left sidebar, you can manage its content. Click on the "+", and change the title of
            the new record. After adjust the record, press "Commit". This commits all changes to the database and makes all changes persistent.
        </p>

        <img src="/assets/documentation/framework/debugger-database-user.png"/>
        
        <h3>Use database</h3>
        
        <p>
            In order to use the created database class, we use our <code>TestCommand</code> again from the Getting Started chapter again.
            We adjust it slightly so it takes our class <code>SQLiteDatabase</code> as dependency.
        </p>
        
        <p>
            You can inject <code>SQLiteDatabase</code> also in services, event listeners, and all other controllers.
        </p>
        
        <textarea codeHighlight>
            import { arg, cli, Command } from '@deepkit/app';
            
            @cli.controller('add-user')
            export class TestCommand implements Command {
                constructor(protected database: SQLiteDatabase) {
                }
            
                async execute(
                    @arg username: string
                ) {
                    const user = new User(username);
                    await this.database.persist(user);
                    console.log('User added with id', user.id);
                }
            }
        </textarea>

        <p>
            As you can see, we inject the <code>SQLiteDatabase</code> directly as constructor argument. 
            Since we registered this class in <code>KernelModule</code> it will automatically be instantiated and injected 
            (since it will be added as provided in the background).
            Let's register the TestCommand and execute it.
        </p>

        <textarea codeHighlight>
            #!/usr/bin/env ts-node-script
            import 'reflect-metadata';
            import { Application, KernelModule } from '@deepkit/framework';
            import { arg, cli, Command } from '@deepkit/app';
            import { entity, t } from '@deepkit/type';
            import { Database } from '@deepkit/orm';
            import { SQLiteDatabaseAdapter } from '@deepkit/sqlite';
            
            @entity.name('user')
            class User {
                @t.primary.autoIncrement id: number = 0;
            
                @t created: Date = new Date;
            
                constructor(@t public username: string) {
                }
            }
            
            
            export class SQLiteDatabase extends Database {
                name = 'default';
                constructor() {
                    super(new SQLiteDatabaseAdapter('/tmp/myapp.sqlite'), [User]);
                }
            }
            
            @cli.controller('add-user')
            export class TestCommand implements Command {
                constructor(protected database: SQLiteDatabase) {
                }
            
                async execute(
                    @arg username: string
                ) {
                    const user = new User(username);
                    await this.database.persist(user);
                    console.log('User added with id', user.id);
                }
            }
            
            Application.create({
                controllers: [TestCommand],
                imports: [
                    KernelModule.configure({
                        databases: [SQLiteDatabase],
                        migrateOnStartup: true,
                        debug: true,
                    })
                ]
            }).run();
        </textarea>
        
        <textarea codeHighlight>
            $ ./app.ts add-user Peter
            User added with id 2
        </textarea>
        
        <p>
            A new user has added and the auto-incremented primary is 2. You can start the server again and take a look into the data browser.
            You will see two records being in the database.
        </p>
        
        <h3>More databases</h3>
        
        <p>
            You can add as many database classes as you want and name it the way you like. Make sure to change the <code>name</code> 
            of each database, so it doesn't conflict with others when using the ORM Browser.
        </p>
        
        <h3>Learn more</h3>
        
        <p>
            To learn more about how the <code>SQLiteDatabase</code> works, please read the chapter <a routerLink="/documentation/orm">Deepkit ORM</a>
            and it sub chapters like how to query data, to to manipulate data via sessions, how to defined relations, and more.
            Please note that the chapters there are related to the standalone library <code>@deepkit/orm</code> and does not contain documentation
            about the Deepkit Framework part you've read above from this chapter.
        </p>
    `
})
export class DocFrameworkDatabaseComponent {
}