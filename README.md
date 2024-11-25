# OneApp Frontend

This application allows a student to sign in and complete a college application form and sign up for a list of universities for their application to be sent to. 

Admins of the system can manage the form, adding and removing questions at their leisure.

Universities can see what students have applied, and download their information directly from the application.

## Project Setup

1. Clone the project into your **XAMPP/xamppfiles/htdocs/oneapp** directory.

```
git clone https://github.com/OC-ComputerScience/one-app-frontend.git
```

2. Install the project.

```
npm install
```

3. Make sure **Apache** is running.

   - We recommend using XAMPP to serve this project.
   - In XAMPP, make sure that **Apache** is running.

4. Compile and run the project locally.

```
npm run dev
```

5. Open http://localhost:8081 in a browser to view the project running.

6. (Optional) Compile the project for production.

```
npm run build
```

7. (Optional) Lint and fix the project files.

```
npm run lint
```

## Style Guide

### Colors
The colors used in this application can be found in ```/src/plugins/vuetify.js```. Generally the colors used will be Primary (#1976D2), Secondary (#575757), and Accent (#FF0000).

#### Buttons
 - Color:
   - Confirmation / action buttons should use Primary
   - Cancel buttons should use Secondary
   - Deletion buttons should use Accent
 - Styling
   - Standalone buttons should be ```variant="outlined"```
   - Dialog buttons should be ```variant="plain"```
   - All buttons should use ```density="comfortable"```

#### Text Fields / Comboboxes / Autocompletes
 - Styling
   - All should use ```variant="outlined"```
   - All should use ```density="compact"```
