# OfferupDeals Server

### This server should be used in conjuction with the [Android/iOS App](https://github.com/ovidubya/offerupdeals-app)

# Install

```sh
$ npm i
```

Or build a docker image

```sh
$ sudo docker build -t offerupserver:latest .
```

# Run server

```sh
$ npm start
```

# Run docker container

```sh
$ docker container run -p 3000:3000 --name offerup_server_container offerupserver
```

# Example Rest Calls

### examples pulled from [test.rest](test.rest)

Install Vscode rest client to debugg/use
