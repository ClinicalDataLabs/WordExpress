# WordPress Express

This project aims to replace PHP with Javascript in WordPress development by using Node.js and Express to consume data from a WordPress database using GraphQL. It uses [Apollo](http://apollostack.com) to fetch the data and deliver it into React components. **This repo is the codebase for [wordexpress.io](http://wordexpress.io), where I will write articles and documentation explaining how it works**.

The core of this project revolves around setting up a connection to a WordPress database using Sequelize, defining models from that connection, and then querying those models using GraphQL. It's delivered through an npm package called WordExpress Schema. [Read the documentation](https://github.com/ramsaylanier/wordexpress-schema) for implementation details and information on how to extend it.

I've also started creating a set of [WordExpress Components](https://github.com/ramsaylanier/WordExpressComponents) that contain GraphQL qeuries based on the WordExpress Schema package. Refer to that repo for documentation.  

Regarding building, this project using Webpack, and requires Node V 5.0.0. You might be able to get away with 4.0, but really just tighten up and use 5.0.

## Docs on Medium
[Part 1 - Introduction](https://medium.com/@verybadhello/wordpress-with-node-react-and-graphql-part-1-introduction-ee0fc491730e#.ir4lezuav)

[Part 2 - The Setup](https://medium.com/@verybadhello/wordpress-with-node-react-and-graphql-part-2-the-setup-adbbfba1e776#.oizvqnau7)

[Part 3 - The Schema](https://medium.com/@verybadhello/wordpress-with-node-react-and-graphql-part-3-the-schema-8569a89016c#.w2dcbi5en)

## Getting Started

### Add the WordExpress Companion Plugin
You'll need to install the [WordExpress Companion Plugin](https://github.com/ramsaylanier/WordExpress-Plugin) into your WordPress plugins directory. Currently, the plugin simply adds a custom field to all WordPress pages that lets you set a React component as a page layout. See the layouts section below for details.

### Install NPM modules and running Locally
Just run `npm install` and then `npm run startdev`, which will start a Webpack Dev Server. It should automatically open a browser window pointed at localhost:3000.

### Building For Production
Run `npm run build`, which creates a `dist` folder in the root directory that contains production-ready code to be deployed to a node server. You can run `npm start` which will start the express server using code in the `dist` folder. There is an `npm run deploy` script that will call a deploy.sh shell script located in the /scripts folder. Mine is not included in this repo, since it contains production server information, and it's specific to my setup.

## Defining Your Application Settings
You'll notice a [settings](https://github.com/ramsaylanier/WordpressExpress/tree/master/settings) folder, which contains JSON files for development. This is where you can define settings for uploads, WP database connection, and some other things. Change accordingly. **For production, create a prod.json file in the same format as dev.json**.

#### Upload Settings
This project uses Amazon AWS with an S3 bucket. If you are hosting your media files on the same server as your WP installation, set amazonS3 to false and set the uploads directory accordingly. If you are using S3, set don't include 'wp-content/uploads' to the end of the setting - it will be added for you.

#### Database Settings
This should be pretty self-explanatory: simply enter in the name of your database, username and password, and host. Make sure these are inside of "private", or else they'll be available on the client (WHICH IS BAD).

## Setting the Front Page
When you run `npm startdev` for the first time, you'll probably get an error saying "cannot find page-title of undefined." This is probably because you haven't set a landing page in WordPress. By default, the [FrontPageLayout](https://github.com/ramsaylanier/WordPressExpress/blob/master/app/components/layouts/FrontPageLayout.js) component queries a post with the post-name (AKA slug) of "homepage". If you are using a fresh WordPress installation, simply create a page and give it a slug of "homepage." If you are working with an existing WordPress database, you can change which page that gets loaded by changing the page query in the `FrontPageLayout` component. See below:

```es6
const FrontPageWithData = connect({
  mapQueriesToProps({ ownProps, state}) {
    return {
      page: {
        query: `
          query getPage{
            viewer{
              page(post_name: "homepage"){
                id,
      		post_title
      		post_content
      		thumbnail
              }
            }
          }
        `
      }
    }
  }
})(FrontPageLayout);
```

Simply change "homepage" to anything you want. Keep in mind that it queries the post-name (AKA slug), not the post-title.

## Using React Components as Layouts

As mentioned above, make sure you have first installed the [WordExpress Companion Plugin](https://github.com/ramsaylanier/WordExpress-Plugin) into your WordPress plugins directory. The plugin will add a custom WordPress meta box to all your WordPress pages. There is a text input field in the meta box called `Page Layout Component`. The value you put in there should match one of the objects in the `Layouts` object in the [layouts directory](https://github.com/ramsaylanier/WordpressExpress/blob/master/app/components/layouts/layouts.js). The `Layouts` object stores some basic parameters that the `WordpressPage` component will read. It looks like this:

```es6
import PostList from '../posts/PostList.js';
import DefaultLayout from './DefaultLayout.js';
import FrontPageLayout from './FrontPageLayout.js';

const Layouts = {
  'Default': {
    Component: DefaultLayout
  },
  'FrontPage': {
    Component: FrontPageLayout
  },
  'PostList': {
    Component: PostList,
    postType: 'post',
    limit: 10,
    skip: 0
  }
};

export default Layouts;
```

In the above example, I have a WordPress page called 'articles'. On this page, I want it to use a PostList component and show posts of the 'post' type, with a limit of 10 posts per page. In the `Page Layout Component` field on the Articles page in the WordPress admin backend, I enter "PostList" and publish the page.

## Playing With GraphiQL
GraphiQL is the in-browser IDE for testing GraphQL queries. For experimentation purposes, I've kept the GraphiQL IDE publically available so you can play around with querying the WordExpress database. [Check it out here](http://wordexpress.io:8080).

## Roadmap
This project started out as just an experiment, but it seems like a lot of other developers have this pain point while developing in WordPress, so I've started building out a road map of features. I'll try to prioritize them.

1) Make Server Side Rendering work. It's weird using Relay, and Facebook doesn't have official support for it, though it seems like it might be coming soon. We need SSR to handle SEO, meta tags, and all that.

2) ~~Need to make layouts work better. Currently, you create a custom field in wordpress for each page called 'react_layout" and just type the name of a React component that will server as the pages "layout." It could be better. Ideally, I'd write a companion WordPress plugin that comes complete with some standard custom fields that work directly with this project.~~ The companion plugin exists!

3) Work on developing more complex queries. The WordExpressDatabase object is currently expandable, meaning after importing the default from `wordexpress-schema` you can add Sequel models and queries to it before passing it into WordExpressGraphQLSchema. However, WordExpressGraphQLSchema is **not** expandable. This should be a thing.

4) ~~Figuring out how to get WordPress shortcodes to work. I'd only expect that built in WordPress shortcodes would work (i.e `[caption]`, but they don't currently. It would require parsing the post_content field and then recognizing short codes and then probably building a unique React component for each shortcode.~~ Currently only a few shortcodes work. I've got Caption working, as well as the ability to embed Github Gists.

## Development

#### Setup

1. Install [Foreman](http://blog.daviddollar.org/2011/05/06/introducing-foreman.html)
2. Install [Docker](https://docs.docker.com/docker-for-mac/)
3. Install [Yarn](https://yarnpkg.com/en/docs/install)

#### Build and Run WordExpress

Install dependencies:

```bash
yarn
```

Use Foreman to start WordPress and MySQL as docker instances using docker-compose and also start WordExpress on the host machine.

```bash
foreman start
```

#### Set Up WordPress

1. Visit [http://localhost:5500](http://localhost:5500).
2. Follow the instructions to initialize a WordPress instance.
3. Download the WordExpress Plugin at https://github.com/ramsaylanier/WordExpress-Plugin/archive/master.zip.
3. Visit [http://localhost:5500/wp-admin/plugin-install.php](http://localhost:5500/wp-admin/plugin-install.php) to upload and install the plugin.
4. Add test posts: [http://localhost:5500/wp-admin/edit.php](http://localhost:5500/wp-admin/edit.php)
5. Set up categories: [http://localhost:5500/wp-admin/edit-tags.php?taxonomy=category](http://localhost:5500/wp-admin/edit-tags.php?taxonomy=category).

#### GraphQL

Visit [http://localhost:8080](http://localhost:8080) to access the GraphiQL tool. There's also a nice standalone [GraphiQL Mac app](https://github.com/skevy/graphiql-app).

#### WordPress Database

Use your favorite MySQL client to access the WordPress MySQL database at ```http://localhost:3306``` using the credentials in ```settings/dev.json```.

#### Using WordExpressSchema Locally

By default, the ```wordexpress-schema``` dependency uses the version from NPM. However, when developing you want to use the ClinicalDataLabs fork locally. Here are the steps:

First, clone ```wordexpress-schema``` locally and install.
```bash
git clone git@github.com:ClinicalDataLabs/WordExpressSchema.git
cd WordExpressSchema
yarn
```

Link local ```wordexpress-schema``` to ```wordexpress```. From the WordExpressSchema directory:

```bash
yarn link
```

Change to the WordExpress directory:

```yarn link wordexpress-schema```

Now ```node_modules/wordexpress-schema``` is a symlink to the local repo.

However, before you can use the local module, you must build it. From the WordExpressSchema directory:

```bash
yarn build
```

IMPORTANT: Every time you make a change to the ```wordexpress-schema```, you will have to build and then restart ```wordexpress```. (TODO: automate this)