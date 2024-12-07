# Tripify2

Welcome to Tripify2, your one-stop platform designed to make your travel planning seamless, stress-free, and enjoyable! Whether you're planning a weekend getaway, a family vacation, or a dream adventure, our website helps you organize every detail of your trip in one place.

## Motivation

Traveling is one of the most rewarding and life-changing experiences, but the planning process can often feel overwhelming and stressful. From managing itineraries to coordinating with friends and family, to staying on top of expenses, the logistics of organizing a trip can quickly become a burden.

Tripify2 was created to simplify this process and make the journey to your dream vacation as smooth as possible. Our goal is to empower travelers by providing a tool that organizes all aspects of trip planning in one intuitive, easy-to-use platform.

By combining personalized itineraries, budgeting tools, collaborative planning, and real-time local insights, we strive to be the ultimate companion in your travel journey. Tripify2 is designed with your convenience in mind, giving you more time to explore the world and less time worrying about the details.

## Build Status

- **Status**: The project is fully implemented, is functioning as expected and is ready for deployment.

- **Frontend**: All functionality is working as expected and accessible via the local development server.

```bash
  cd client
  npm run start
```

- **Backend**: Fully implemented with all API endpoints thoroughly tested, including edge cases, using Postman.

```bash
  cd server
  npm run dev
```

- **Testing**:
  - Postman API tests: ✅
  - User Acceptance Testing: ✅
  - Feature-Centric Testing: ✅
  - Black-Box Testing: ✅
  - Requirement-Based Testing: ✅
- **Deployment**:
  - Fully optimized and ready for deployment.

## Code Style

### Client Side (Frontend)

- **Reusable Components**: Components are organized in the `components` folder for easy reuse and accessibility.

- **Folder Names**: Folder names use lowercase and single words for consistency

  - Example: `@tourist`, `@admin`

- **File Names and Content**: React component files `.jsx` follow PascalCase naming conventions and JavaScript files follow lowercase name convention

  - Example: `CheckoutComponent.jsx`, `ForgotPassword.jsx`, `ItineraryCard.jsx`
  - Example: `page.js`, `sellerprofile.js`

- **Variables and Helpers**: Variables and Helper functions are named in camelCase for improved clarity and maintainability.

  ```javascript
  "use client";
  const router = useRouter();
  const session = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
    router.push("/");
  };
  ```

### Server Side (Backend)

- **Folder Names**: Folder names use lowercase and single words for consistency.

  - Example: `controllers`, `middleware`, `models`, `routes`

- **File Names**: Files follow camelCase naming, except for Models which use PascalCase.

  - Example: `bookingController.js`, `verifySeller.js`, `userRoutes.js`
  - Example: `Itinerary.js, Advertiser.js`

- **Variables and Helpers**: Variables and Helper functions are named in camelCase for improved clarity and maintainability.

  ```javascript
    const deleteActivity = async (req, res) => {
    const { id } = req.params;

    const advertiser = await advertiserModel.findOne(
      { UserId: req._id },
      "UserId"
    );

    const deletedActivity = await activityModel.findById(id);
  ```

## Screenshots

## Tech/Frameworks Used

This project harnesses the power of the MERN stack, enhanced by Next.js to enable server-side rendering for improved client-side performance. It integrates various libraries and frameworks to streamline development and deliver a robust, scalable solution.

### Core Technologies:

- **MongoDB**: NoSQL database, which distinguishes it from traditional relational databases. Its flexible structure enables faster and more dynamic data modeling, allowing for better scalability and adaptability.

- **Express.js**: Node.js framework that streamlines the development of web applications and APIs. It offers powerful features for efficient routing, middleware integration, and enhanced functionality.

- **React.js**: JavaScript library for building user interfaces

  - **Next.js**: _React.js_ framework that provides server-side rendering and API routes and is used for building fast full-stack React.js applications

- **Node.js**: Runtime environment which allows for JavaScript to be run outside of the browser, enabeling the creation of server-side applications using JavaScript

### Additional Tools and Libraries:

- **bcrypt**: Library for hasing passwords and securely stoting them.

- **cookie-parser**: Middleware for _Express.js_ that parses cookies from incoming HTTP requests.

- **axios**: HTTP client for sending API requests.

- **cors**: Middleware for handling Cross-Origin Resourse Sharing.

- **dotenv**: Library for loading environment variables.

  - Example: `HOTEL_API_KEY`, `FRONTEND_URL`, `MONGODB_URI`

- **jsonwebtoken**: Library for generating and verifying JSON Web Tokens.(JWTs)

- **node-cron**: Task scheduler for Node.js, used for notification handleing on our website.

- **nodemailer**: Node.js module for sending emails.

- **stripe**: For integrating payment processing into our website.

- **react-hook-form**: Library for handling forms and validations.

- **date-fns**: Modern JavaScript date utility library for manipulating and formatting data.

- **country-reverse-geocoding**: Converts geographic coordinates into country names.

### UI Frameworks and Libraries

- **tailwindcss**: Utility-first CSS framework for building modern and responsive designs.

- **frigade/react**: Library for building onboarding flows and tutorials for React.js applications. Used for the step-by-step guide.

- **lucide-react / @radix-ui**: Open source React.js icons and highly customizable pre-built components for building more complex UI components.

### Development Tools

- **Git**: Version control system for tracking code changes, enabeling collaboration and managing project history.

- **Postman**: Used for testing and debugging API endpoints.

- **Prettier**: Code formatter that enforces a consistent coding style across the codebase.

- **Figma**: Interface design tool for prototyping the UI

- **Miro**: Versatile online collaborative whiteboard platform used for brainstorming, wireframing, and visually organizing project requirements.

## Features

### User Authentication and Authorization

- **Authentication**

  - Verifying user's identity using vredentials like username, password and tokens.

- **Authorization**

  - Determines what actions and resources a verified user is permitted to access bases on their role and permissions.
  - _Method used_: Role-Based Access Control.
    - **Tourist**
    - **Tour Guide**
    - **Adveriser**
    - **Tourism Governor**
    - **Seller**
    - **Admin**

- **Session Managmenet**
  - Ensure secure handling of httpOnly cookies, session tokens or JWTs.
  - Includes accessTokens and refreshTokens for enhanced security.

### Role-Specific Dashboards

- **Access Control Based on Role**: Each user has a personalized dashboard tailored to their role, granting access only to the specific website endpoints and features that are relevant to them.
- **Customized Views**: Depending on the role, users will see a unique set of data and tools, ensuring a focused and efficient user experience.
  - _Tourists_: may have access to booking details, itineraries, and recommended destinations.
  - _Tour Guides_ can manage tour schedules, customer interactions, and itineraries.
  - _Advertisers_ have access to activity creation and scheduling.
  - _Tourism Governors_ can access place creation onto the system.
  - _Sellers_ can list products, manage bookings, and view sales performance.
  - _Admins_ have full control, overseeing system settings, user management, and the overall operation of the platform.

### Personalized Planning

- **Tourist**:

  - Can create and personalize their profiles to receive tailored notifications for events, attractions, and activities that match their interests, ensuring they never miss out on exciting opportunities.
  - Can easily access the platform at any time to explore the best flight options, accommodation, and transportation methods, enjoying a seamless, worry-free travel experience. With exclusive promotional codes and special offers, tourists can save while planning their next adventure.

- **Tour Guide**:

  - Can monitor the performance of their created itineraries, gaining insights into customer satisfaction and engagement.
  - Can access detailed tourist activity and sales reports to fine-tune their offerings, optimize schedules, and enhance the overall tour experience for maximum profitability.

- **Advertiser**:

  - Can track the success of their promotional activities, measuring their impact on tourism engagement and conversions.
  - Can view detailed reports on tourist activity and sales, allowing them to refine their marketing strategies and better target their audience for higher returns.

- **Tourism Governor**:

  - Have the ability to create and manage popular tags for historical sites, enhancing visibility and encouraging more website users to engage with these attractions.
  - Can add new locations and destinations to the system, ensuring that the platform remains up-to-date with the latest tourism hotspots and opportunities for exploration.

- **Seller**:

  - Can manage and list their tourism-related products with options, ensuring they are easily accessible to potential customers.
  - They have access to detailed sales reports, helping them track performance, identify trends, and adjust their offerings accordingly

- **Admin**:
  - Have full access to the platform, enabling them to manage all aspects of the system, including content and settings.
  - Have full access to the platform, enabling them to manage all aspects of the system, including user roles, content, and settings.

### Usability

- **Easy to Use**

  - The platform offers an intuitive interface, making it easy for users of all experience levels to navigate and access key features.
  - With streamlined workflows and simplified navigation, users can efficiently manage their bookings, itineraries, and activities without hassle.

- **Real-Time Notifications**

  - Emails: Users receive instant email notifications about updates, promotions, and important events related to their interests or activities.
  - On-System: Real-time alerts are displayed within the platform to keep users informed about booking status, special offers, or changes to itineraries as they happen.

- **Rating, Feedback and Complaints**

  - Users can leave ratings and feedback on services, tours, activities and products to help improve offerings and assist other users in making informed decisions.
  - The platform provides a dedicated section for handling complaints and resolving issues promptly, ensuring customer satisfaction and fostering trust in the services provided.

- **Gift Shop**
  - The gift shop offers a wide range of tourism-related products and souvenirs, allowing users to purchase memorable items from their travels.
  - Multiple payment methods are supported, including credit cards, digital wallets, and cash on delivery, ensuring a seamless and convenient shopping experience for users.

## Code Snippets
