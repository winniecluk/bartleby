## Forge

1. Read this: https://developer.atlassian.com/platform/forge/getting-started/. After this step, you should have:
  - the Forge CLI installed
  - created an API token for your user
 
2. Create an ngrok account for HTTP tunneling: https://go.atlassian.com/forge-tunnel-ngrok. You will need to have Docker already installed. Once you've created the account, follow the instructions to get the config file path. Then run `forge settings set ngrok-config-path <path/to/your/file>`.
 
3. Create a cloud developer site: http://go.atlassian.com/cloud-dev. This will give you a development environment to work in.
 
4. If you haven't done this before, do the first three tutorials linked here: https://developer.atlassian.com/platform/forge/build-a-hello-world-app-in-confluence/


## Quick start

Install top-level dependencies:
```
npm install
```
<br />

Install dependencies inside of the `static/bartleby` directory:
```
npm install
```
<br />

Set environment variables via the command line. Reach out to your administrator for the values.
```
forge variables set
```
<br />

Modify your app by editing the files in `static/bartleby/src/`.

Build your app (inside of the `static/bartleby` directory):
```
npm run build
```
<br />

Deploy your app by running:

```
forge deploy
```
<br />

Install your app in an Atlassian site by running:
```
forge install
```
The app needs to be installed in both Confluence and JIRA for full functionality. You will need to run this command twice.

### Notes
- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- You may choose to use `forge tunnel` while working to see your changes without having to deploy. You will need to save the changes and run `npm run build` in the `static/bartleby` directory.

## Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for how to get help and provide feedback.




