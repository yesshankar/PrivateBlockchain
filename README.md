# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the [Node.js® web site](https://nodejs.org/en/).

## Configuring your project

### Cloning Project Repository

- Open Git Bash.
- Change the current working directory to the location where you want the cloned directory to be made.
- Then type
```
git clone https://github.com/yesshankar/PrivateBlockchain.git
```
- Hit Enter. Your local clone will be created.

### Installing dependencies

> This project uses **Express.js** framework.

In this project, there is a file called `package.json`, which has a list of all the dependency  modules.
From the command line tool, go the the current project directory and enter the command `npm install`.
This will download all the dependency modules used in this project.



## Using RESTful API service

This RESTful web API currently has two endpoints.

- GET /block/*block-height*
and
- POST /block

> **Note:** All response from the server is in `application\json` fromat. [**Postman**](https://www.getpostman.com/) is recommeded to test each endpoint as Postman automatically sets the request header `Content-Type` according to the body content. You can also set your own header content.

### GET endpoint usage
To get the block infromation at block heihgt 0.
- **GET Request**
```
http://localhost:8000/block/0
```
- **Response**
```
{
    "hash": "acf98875c4880a02861875c7ff3bfe4f1ccf04fe56665859e18c4b17883d1f92",
    "height": 0,
    "body": "This is the first block in chain: Genesis Block",
    "time": "1538111814",
    "previousBlockHash": ""
}
```
> **Note:** You will get error message if if block number you request does not exist. Post some data to and request again with block height in range.
```
{
    "error": "No block found @ block height = 13"
}
```
### POST endpoint usage
To post a new block.
- **Post Request**
```
http://localhost:8000/block
```
with block data in the body (payload) in JSON format as:
```
{
      "body": "Testing block with test string data"
}
```
- **Response**
```
{
    "hash": "dd1b0a97301854ba62a7fb76a1c12519d42b34a1d6b4f3668ccd130e7c2f08bc",
    "height": 2,
    "body": "Testing block with test string data",
    "time": "1538148875",
    "previousBlockHash": "1755998f53bc704e9fe5d833844351a6674875afc1ab724e7c4da4de7f071726"
}
```
> **Note:** You will get error message in `POST` request if the request body is empty or body data is not in `JSON` format or body key is not found in data object or value of body key is not in `string`.
```
{
    "error": "Body was empty OR payload was sent in other fromat than JSON."
}
```

```
{
    "error": "Data was not received in proper format. JSON object with body as a key and its value in string format was expected."
}
```

