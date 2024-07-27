# Welcome To Eve
Eve is your personal Ai Technical Interviewer. 


Check out the live version [here](https://ai-technical-interviewer.web.app/)
If this isn't working (which would only be due to API costs), you can run Eve locally on your machine.

## To run this project:
Ensure you have Node.js installed on your machine. If not, you can download it [here](https://nodejs.org/en/download/).
Ensure you have the following in your environment variables:
- `VITE_APP_API_KEY` - Firebase API Key
- `VITE_APP_AUTH_DOMAIN` - Firebase Auth Domain
- `VITE_APP_PROJECT_ID` - Firebase Project ID
- `VITE_APP_STORAGE_BUCKET` - Firebase Storage Bucket
- `VITE_APP_MESSAGING_SENDER_ID` - Firebase Messaging Sender ID
- `VITE_APP_APP_ID` - Firebase App ID
- `VITE_APP_MEASUREMENT_ID` - Firebase Measurement ID
- `VITE_APP_API_ENDPOINT="http://127.0.0.1:5000"` - Local API endpoint (change port if necessary)

1. Clone the repository
2. Run `npm install` or `yarn install`
3. Run `npm run dev` or `yarn dev`

Then clone our backend repository [here](https://github.com/JoseG777/Ai-Tech-Interviewer-BE) and follow the instructions to run the backend.
IMPORTANT: CLONE THE emergency_hosting BRANCH

# React + Vite
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
