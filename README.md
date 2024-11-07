# GEFION

Gefion is a modern, flexible, and powerful Node.js framework named after the Norse goddess of fertility and abundance. Just as the goddess Gefion carved new land from the earth, this framework aims to carve a path toward clean, efficient, and scalable application development.

Gefion is designed to be as versatile as it is reliable, offering an intuitive structure that can accommodate projects of all sizes from simple APIs to complex, full-stack applications. It harnesses the power of modern JavaScript, providing you with the tools needed to streamline development, enhance performance, and optimize workflow.

## Getting Started

These instructions will give you a copy of the project up and running on
your local machine for development and testing purposes. See deployment
for notes on deploying the project on a live system.

### Installing

A step by step series of examples that tell you how to get a development
environment running

Clone project

    git clone https://github.com/omerfdmrl/gefion
    cd gefion
    npm run dev

End you are free to go!

### File Hierarchy
- app: This folder includes your models, workers, jobs and classes that responsible for provide system functionality
  - Console: Kernel file for define your commands that will work on background
  - Http: This folder includes yours controllers, middlewares, validations and Kernel file that registers your functions to framework
    - Controllers: For define controllers functions
    - Middlewares: For define middleware functions
    - Validations: For define validations to your routes
  - Jobs: It's for define your jobs to use
  - Models: It's for define your models
  - Providers: This files responsible for make connection your database and start serve your server
  - Workers: It's for define your workers to use
- bootstrap: This files responsible for boot framework
- configs: You can define custom configs or edit default settings such as database connection, cache, filesystem etc.
- database: 
  - factories: You can make factory of your models to feed your models
  - seeders: You can call define function and amount
- packages: This folder includes current packages that works with framework for extend it
- resources: This folder includes your front-side files and email templates
- routes:
  - api: File for defining your routes. (you can change name or add new route file from app/Http/Kernel file)
  - commands: File for defining functions of commands. (you can use this functions in app/Console/Kernel file)
- storage: This folder includes your storage files
- test: Test functions of framework
- vendor: Required classes for framework

### Functionalities

#### Cache
Cache class is for caching abilities. Usage; 
```js
config/cache.config.js
const Storage = require("@gefion/storage");
{
  "provider": "local1", // for define which provider will use (based on keys in this file)
  "local1": {
    "provider": "local", // local will storage your caches inside of framework
    "path": Storage.storage("cache"), // path to storage files (storage/cache/)
    "filePerKey": "true", // if the name of file not defines and sets to true, cache class will create new file for per cache keys defaulty
    "ttl": 3600 // default tll value
  }
}

AnyFile.js
// long way
// const Cache = require("@gefion/cache");
// const cache = Cache.provider();
cache().file('myCacheFile') // name of file to cache to specify it (not required - default file name is 'cache')
       .ttl(60)             // set time-to-live in minutes (not required)
       .set('foo', 'bar');  // cache the 'bar' value with 'foo' key

// will return undefined, becasue we use specified file name as 'myCacheFile', if you dont do it, it will work
// const cachedValue = cache().get('foo');
const cachedValue = cache().file('myCacheFile').get('foo');
console.log(cachedValue); // 'bar'

cache().set('rick', ['and', 'morty']); // we can use string, number, json data, array
cache().append('rick', '100 years'); // if we use array, we can append new data easly
console.log(cache().get('rick')); // ['and', 'morty', '100 years']

cache().del('rick'); // delete cached value by key
console.log(cache().get('rick')); // undefined

cache().deleteEmptyFiles(); // it will delete empty files, useful for not store empty files
// recommended to use with cammand
```

...
(other functionalities will come)

## Plox
Plox is a powerful command-line interface designed for the Gefion framework. It provides developers with essential tools to manage their projects, streamline the development process, and automate routine tasks. With Plox, you can create new components, configure application settings, and effortlessly manage the structure of your project. This easy-to-use tool saves you time while enhancing the efficiency of your applications.

You can run help command for list all commands: `node plox help`
```
                                  Commands                                  
┌───────┬──────────────────┬──────────────────────┬────────────────────────┐
│ Index │ Command          │ Description          │ Usage                  │
├───────┼──────────────────┼──────────────────────┼────────────────────────┤
│   1   │ make:controller  │ Make Contoller       │ make:controller <name> │
│   2   │ make:model       │ Make Model           │ make:model <name>      │
│   3   │ make:validation  │ Make Validation      │ make:validation <name> │
│   4   │ make:job         │ Make Job             │ make:job <name>        │
│   5   │ make:worker      │ Make Worker          │ make:worker <name>     │
│   6   │ list:routes      │ List All Routes      │ list:routes            │
│   7   │ list:validations │ List All Validations │ list:validations       │
│   8   │ list:middlewares │ List All Middlewares │ list:middlewares       │
│   9   │ list:jobs        │ List All Jobs        │ list:jobs              │
│  10   │ add              │ Add Extension        │ add <name>             │
│  11   │ remove           │ Remove Extension     │ remove <name>          │
└───────┴──────────────────┴──────────────────────┴────────────────────────┘
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

## Versioning

We use [Semantic Versioning](http://semver.org/) for versioning. For the versions
available, see the [tags on this
repository](https://github.com/omerfdmrl/gefion/tags).

## Authors

- **Ömer Faruk Demirel** - _Main Developer_ -
  [omerfdmrl](https://github.com/omerfdmrl)
- **Billie Thompson** - _Provided README Template_ -
  [PurpleBooth](https://github.com/PurpleBooth)

See also the list of
[contributors](https://github.com/omerfdmrl/gefion/contributors)
who participated in this project.

## License

This project is licensed under the [MIT](LICENSE.md)
Creative Commons License - see the [LICENSE.md](LICENSE.md) file for
details
