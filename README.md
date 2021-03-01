# Description

This project is a radio player which plays the munich based radio station `radio 2day` - whilst a song is playing the user can check the song (much like shazam) the user can then add the song to their personal spotify account - the app will create and add to a playlist called 2day4life.

Please feel free to fork the app and play around.

For any questions or comments please do not hesitate to contact me - cor@macbeagan.me

## Getting Started

Clone the repo and cd into the folder.

Then run

```bash
npm install
```

To install the dependencies

Then run

```bash
npm start
```

To start the development server, it will open the app in a browser.

## Using

You will need get API keys for Spotify and Audd.io and add them to a .env file in the root directory.

1. [AudD.io](https://audd.io/) costs $2 per month for 1000 hits (credit card needed) - but is easy to access.

2. [Spotify](https://developer.spotify.com/) offer's free access to their API. To run this app you will need to have both the Client ID and the Client Secret

Please note that deploying the app as is exposes the API tokens on the client and is not advisable.

## Deployment

Run

```bash
npm build
```

To create a production build

### Licence

MIT © P. Cormac Beagan
