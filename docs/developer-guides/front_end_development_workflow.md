# Front End Development Workflow

## Major Technologies Used in Project Jellyfish
####Server and Support
* Ruby >= 2.2
* Puma
* SAML
* AnnotateModels
* Rufus-Scheduler
# Storage
* Postgress

####Front-End
* AngularJS >=1.3
* AngularUI Router
* Bootstrap
* SASS

#### Testing
* Selenium WebDriver
* Capybara

*_For the complete listing of resources, investigate this [Gemfile](https://github.com/projectjellyfish/api/blob/master/Gemfile)_



## Dependency Management
Dependencies are managed as [Rails Assets](https://rails-assets.org) and within the Gemfile look a little like this:

```ruby
    # Add Dependencies
    source 'http://rails-assets.org' do
      gem 'rails-assets-angularjs'
      gem 'rails-assets-angucomplete-alt'
      gem 'rails-assets-angular-animate'
      gem 'rails-assets-bootstrap-sass'
      gem 'rails-assets-fontawesome'
      ...
    end
```


Adding a new dependency to Project Jellyfish is now a three part process:

1). Confirm the existence and name of the asset on [Rails Assets](https://rails-assets.org) then add it winthin the dependency _do_ in the gemfile.  For this example we'll add the **leaflet** dependency.
```ruby
    # Add Dependencies
    source 'http://rails-assets.org' do
      gem 'rails-assets-angularjs'
      gem 'rails-assets-angucomplete-alt'
      gem 'rails-assets-angular-animate'
      **gem 'rails-assets-leaflet'**
    end
```


2). Next the dependency must be added to **application.js** or **application.scss** (depending on the type of dependency, script or style).  As of writing, these resources are located here:[app/assets/javascripts/](https://github.com/projectjellyfish/api/blob/master/app/assets/javascripts/application.js) and here: [app/assets/stylesheets/](https://github.com/projectjellyfish/api/blob/master/app/assets/stylesheets/application.sass).

* Adding a dependency to [app/assets/javascripts/application.js](https://github.com/projectjellyfish/api/blob/master/app/assets/javascripts/application.js) follows the pattern of existing dependencies, be sure to use the correct name, again, this is listed on [Rails Assets](https://rails-assets.org) when you look up the dependency.
    ```javascript

        //= require angularjs
        //= require angucomplete-alt
        //= require angular-animate
        //= require leaflet
    ```
* Adding a dependency to [app/assets/stylesheets/application.sass](https://github.com/projectjellyfish/api/blob/master/app/assets/stylesheets/application.sass)
    ```sass
        @charset 'utf-8'

        @import 'fontawesome'
        @import 'bootstrap-sass'
        @import 'leaflet'
    ````


3). _(when adding angular modules)_ Now that we have made our new dependencies available to Project Jellyfish all that remains is to include our new dependency module in **broker** in index.js @ path [app/assets/javascripts/](https://github.com/projectjellyfish/api/blob/master/app/assets/javascripts/index.js)

And there you have it! All that is required to include new dependencies in your Project Jellyfish.  Gems are installed at bundle, no other configuration is required.


## View/Controller Modification
HTML partials are stored in [public/templates/partials](https://github.com/projectjellyfish/api/tree/master/public/templates/partials).  Most controllers that support each partial are located in a tree matching the structure of the HTML partials and sharing the same name in [app/assets/javascripts/](https://github.com/projectjellyfish/api/tree/master/app/assets/javascripts)

For example:
* [assets/javascripts/admin/projects/project_questions_controller.js](https://github.com/projectjellyfish/api/blob/master/app/assets/javascripts/admin/projects/project_questions_controller.js)
* [public/templates/partials/admin/projects/project_questions.html](https://github.com/projectjellyfish/api/blob/master/public/templates/partials/admin/projects/project_questions.html)



## Style Modifications

### Font/Icon Inclusion
After desired font/icon dependency is made available in [app/assets/fonts/font-awesome](https://github.com/projectjellyfish/api/tree/master/app/assets/fonts/font-awesome) proceed to add record of the resource to [app/assets/stylesheets/common/_fonts.sass](https://github.com/projectjellyfish/api/blob/master/app/assets/stylesheets/common/_fonts.sass) following the pattern below:
```sass
    @font-face
    font-family: 'FontAwesome'
    src: font-url('font-awesome/fontawesome-webfont.eot')
    src: font-url('font-awesome/fontawesome-webfont.svg') format('svg')
    src: font-url('font-awesome/fontawesome-webfont.ttf') format('truetype')
    src: font-url('font-awesome/fontawesome-webfont.woff') format('woff')
    font-weight: normal
    font-style: normal
```
