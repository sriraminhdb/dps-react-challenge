# DPS Frontend Coding Challenge: German Address Validator #

Your task is to build a small web application that validates German postal codes (PLZ) and localities using the **Open PLZ API**.
API reference: https://www.openplzapi.org/en/germany.

## Project Setup

This repository comes **pre-configured with React and Vite**. You are free to use additional tools or libraries.
You may either fork this repository or create a new one and restructure the application as you see fit.

## Environment Setup

Ensure you have Node.js (v14.x or later) and npm (v6.x or later) installed.  
To set up and run the application, execute the following commands:

```
npm install
npm run dev
```

The application will then be accessible at http://localhost:3000.

## Project Description

Create an address input form with two required fields.
- **Locality** (city/town name)
- **Postal Code (PLZ)**
These fields must validate each other using live data from the Open PLZ API.

**Usage scenarios.**
1. Lookup by locality. When the user types a city/town name:
- If one postal code exists for this locality → automatically fill the PLZ field.
- If multiple postal codes exist → convert the PLZ field into a dropdown.
2. Lookup by postal code. When the user enters a PLZ:
- If PLZ is valid → automatically fill the locality field.
- If PLZ is invalid → show an error message.

### Features Added 
1. Automatically creates a dropdown when the locality is entered.
2. Automatically fills the locality in the respective field after the PLZ is entered.
3. Added a reset button for the user to proceed with the next search without refreshing.

### AI Usage
Link to the AI Usage - [Click Here](https://chatgpt.com/share/69501ef7-a69c-8012-8785-6a4014037498)

Happy coding!
