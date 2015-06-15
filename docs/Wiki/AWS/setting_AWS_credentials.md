# Setting AWS Credentials

**There are currently three ways to set your AWS credentials:**


1.  All application settings can be configured using environment variables in the operating system's environment.
See [Application and Gem Environment Variables](https://github.com/projectjellyfish/api/wiki/Application-and-Gem-Environment-Variables) for more information.


2.  Create a file in the applications root path using a ```.env``` extension. This file should not have a name.


3.  If deploying with Heroku, AWS credentials can be added into the Settings tab in your Config Variables.


-----