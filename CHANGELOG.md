# Change Log

## 0.5.8

- Bug fix #33 failed to query with ObjectId 

## 0.5.7

- Bug fix #32 Cannot execute after saving editor file

## 0.5.6

- cannot run command: MongoRunner Editor #31

## 0.5.5

- fix #30 that last line is alway showing error on mongo runner editor

## 0.5.4

- Fix a defect about initial load on MongoDB Runner configuration.
- Fix failed to connect database issue.

## 0.5.2

- MongoDB Runner Language Server

  - With MongoDB Runner language server, you can use MongoDB NodeJS driver to operate database. It supports run all script on the editor or run each statement. It will render `explain` command on the selected commands.
  - Support syntax diagnostic as you typing.
  - Support format code.
  - Auto attach `toArray` and `limit` on `find` commands.

## 0.0.18

- Enable private key connection
- Enable setting password in the configuration
- Fix configuration schema warning errors
- Add support for query ObjectID
- Add refresh button
- Support manually input database password
- Order menu items
- Support loading mutiple MongoDB connections

## 0.0.5

Update plugin icon.
Support all mongodb connection options.
Update replicatset tree icon.

## 0.0.1

Initial release.
