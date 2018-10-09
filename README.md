# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

This project requires Node and NPM. Installing Node and NPM is pretty straightforward using the installer package available from the [Node.js® web site](https://nodejs.org/en/).

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
From the command line tool, go to the the current project directory and enter the command `npm install`.
This will download all the dependency modules used in this project.



## Using RESTful API service

This RESTful web API currently has following endpoints.

- POST /requestValidation
- POST /message-signature/validate
- POST /block
- GET /stars/address:[ADDRESS]
- GET /stars/hash:[HASH]
- GET /block/[HEIGHT]


> **Note:** All response from the server is in `application\json` fromat. [**Postman**](https://www.getpostman.com/) is recommeded to test each endpoint as Postman automatically sets the request header `Content-Type` according to the body content. You can also set your own header content.


### POST endpoint usage
To post a new block,user must follow the steps to verify identity. 

1. Send the POST request at /requestValidation endpoint
    - **Post Request**
    ```
    http://localhost:8000/requestValidation
    ```
    with the wallet address in the body (payload) in JSON format as:
    ```
    {
        "address": "1DBGjUatDRKLASgHKS3oTULJXz8kfG5uiS"
    }
    ```
    - **Response**
    ```
    {
        "address": "1DBGjUatDRKLASgHKS3oTULJXz8kfG5uiS",
        "requestTimeStamp": "1539044877",
        "message": "1DBGjUatDRKLASgHKS3oTULJXz8kfG5uiS:1539044877:starRegistry",
        "validationWindow": 300
    }
    ```
    > **Note:** You will get error message in `POST` request if the request body is empty or body data is not in `JSON` format or address key is not found in data object or value of address key is not in `string`.
    ```
    {
        "error": "Body was empty OR payload was sent in other fromat than JSON."
    }
    ```

    ```
    {
        "error": "No address property found!, POST data is not in proper format."
    }
    ```
2. Send the POST request at /message-signature/validate endpoint with signature of message received from step 1.
    - **Post Request**
    ```
    http://localhost:8000/message-signature/validate
    ```
    with the wallet address and message-signature in the body (payload) in JSON format as:
    ```
    {
        "address": "1DBGjUatDRKLASgHKS3oTULJXz8kfG5uiS"
        "signature": "IDnFF+L6fz0lHVG8z6dcXndkwLmXB2HMO4JVSyZvO/2RJWm4jgTzjoUk2w5xe7o0xhYjY69XmMcFB26S30KOl/E="
    }
    ```
    - **Response**
    ```
    {
        "registerStar": true,
        "status": {
            "address": "1DBGjUatDRKLASgHKS3oTULJXz8kfG5uiS",
            "requestTimeStamp": "1539044877",
            "message": "1DBGjUatDRKLASgHKS3oTULJXz8kfG5uiS:1539044877:starRegistry",
            "validationWindow": 220,
            "messageSignature": "valid"
        }
    }
    ```
3. Once the message-signature is validated, you can POST new block data at /block endpoint
    - **Post Request**
    ```
    http://localhost:8000/block
    ```
    with the wallet address and star infromation in the body (payload) in JSON format as:
    ```
    {
        "address": "1DBGjUatDRKLASgHKS3oTULJXz8kfG5uiS"
        "star": {
            "dec": "-26° 29' 24.9",
            "ra": "16h 29m 1.0s",
            "story": "Found star using https://www.google.com/sky/ for second time"
        }
    }
    ```
    - **Response**
    ```
    {
        "hash":"a3627c3de2c35b3c7ac021aa68518c0fe97e99695f4a7bad5000a969492a0b67",
        "height":2,
        "body":{"address":"1DBGjUatDRKLASgHKS3oTULJXz8kfG5uiS",
            "star":{
                "dec":"-26° 29' 24.9",
                "ra":"16h 29m 1.0s",
                "story":"466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f20666f72207365636f6e642074696d65"
            }
        },
        "time":"1539045000",
        "previousBlockHash":"acf09f1cc8f91648369d4601f19a23f390a3b5ac54af317054f50a8de0f05eda"
    }
    ```
    > **Note:** Star must have all the properties shown in above request example. You can add other optional properties.
    JSON object schema must match as shown in the example above and story **should not exceed 500 bytes** size limit . Otherwise you will get an error message like:
    ```
    [
        "error": "Exceeds star story size limit of 500 bytes. Received 834 bytes"
    ]
    ```

### GET endpoint usage
You can get block information in three ways:

1. By the wallet address using GET /stars/address:[ADDRESS] endpoint
    - **GET Request**
    ```
    http://localhost:8000/stars/address:1DBGjUatDRKLASgHKS3oTULJXz8kfG5uiS
    ```
    - **Response**
    ```
    [
        {
            "hash":"a3627c3de2c35b3c7ac021aa68518c0fe97e99695f4a7bad5000a969492a0b67",
            "height":2,
            "body":{
                "address":"1DBGjUatDRKLASgHKS3oTULJXz8kfG5uiS",
                "star":{
                    "dec":"-26° 29' 24.9",
                    "ra":"16h 29m 1.0s",
                    "story":"466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f20666f72207365636f6e642074696d65",
                    "storyDecoded":"Found star using https://www.google.com/sky/ for second time"
                }
            },
            "time":"1539045000",
            "previousBlockHash":"acf09f1cc8f91648369d4601f19a23f390a3b5ac54af317054f50a8de0f05eda"
        },
        {
            "hash":"7b527e62c690cecfe57625188594b4b74da9b3d29509349354b499e6968afd58",
            "height":3,
            "body":{
                "address":"1DBGjUatDRKLASgHKS3oTULJXz8kfG5uiS",
                "star":{
                    "dec":"-26° 29' 24.9",
                    "ra":"16h 29m 1.0s",
                    "story":"466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f20666f722074686972642074696d65",
                    "storyDecoded":"Found star using https://www.google.com/sky/ for third time"
                }
            },
            "time":"1539049136",
            "previousBlockHash":"a3627c3de2c35b3c7ac021aa68518c0fe97e99695f4a7bad5000a969492a0b67"
        }
    ]
    ```
    > **Note:** You will get an array of blocks that are registered with given address. If no blocks were found, **empty array** `[]` will be returned.

2. By the hash of block using GET /stars/hash:[HASH] endpoint
    - **GET Request**
    ```
    http://localhost:8000/stars/hash:a3627c3de2c35b3c7ac021aa68518c0fe97e99695f4a7bad5000a969492a0b67
    ```
    - **Response**
    ```
    {
        "hash":"a3627c3de2c35b3c7ac021aa68518c0fe97e99695f4a7bad5000a969492a0b67",
        "height":2,
        "body":{
            "address":"1DBGjUatDRKLASgHKS3oTULJXz8kfG5uiS",
            "star":{
                "dec":"-26° 29' 24.9",
                "ra":"16h 29m 1.0s",
                "story":"466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f20666f72207365636f6e642074696d65",
                "storyDecoded":"Found star using https://www.google.com/sky/ for second time"
            }
        },
        "time":"1539045000",
        "previousBlockHash":"acf09f1cc8f91648369d4601f19a23f390a3b5ac54af317054f50a8de0f05eda"
    }
    ```

3. By the block height using GET /block/[HEIGHT] endpoint
    - **GET Request**
    ```
    http://localhost:8000/block/1
    ```
    - **Response**
    ```
    {
        "hash":"acf09f1cc8f91648369d4601f19a23f390a3b5ac54af317054f50a8de0f05eda",
        "height":1,
        "body":{
            "address":"17kmQq9apA3k8LXPPPPZtnKF6866LNUage",
            "star":{
                "dec":"-26° 29' 24.9",
                "ra":"16h 29m 1.0s",
                "story":"466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f20666f722066697273742074696d65",
                "storyDecoded":"Found star using https://www.google.com/sky/ for first time"
            }
        },
        "time":"1539044368",
        "previousBlockHash":"f6a7c8a8ec53cbff669bbfaa1b36d45e61f2e2c9bd9307dc0c3c57eb8252352c"
    }
    ```

    