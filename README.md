
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
    "use client"
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


## Screenshots




