

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

## Tech/Frameworks Used

This project harnesses the power of the MERN stack, enhanced by Next.js to enable server-side rendering for improved client-side performance. It integrates various libraries and frameworks to streamline development and deliver a robust, scalable solution.

### Core Technologies:

- **MongoDB**: NoSQL database, which distinguishes it from traditional relational databases. Its flexible structure enables faster and more dynamic data modeling, allowing for better scalability and adaptability.

- **Express.js**: Node.js framework that streamlines the development of web applications and APIs. It offers powerful features for efficient routing, middleware integration, and enhanced functionality.

- **React.js**: JavaScript library for building user interfaces
  - **Next.js**: *React.js* framework that provides server-side rendering and API routes and is used for building fast full-stack React.js applications

- **Node.js**: Runtime environment which allows for JavaScript to be run outside of the browser, enabeling the creation of server-side applications using JavaScript

### Additional Tools and Libraries:

- **bcrypt**: Library for hasing passwords and securely stoting them.

- **cookie-parser**: Middleware for *Express.js* that parses cookies from incoming HTTP requests.

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
  - *Method used*: Role-Based Access Control.
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
  - *Tourists*: may have access to booking details, itineraries, and recommended destinations.  
  - *Tour Guides* can manage tour schedules, customer interactions, and itineraries.
  - *Advertisers* have access to activity creation and scheduling.
  - *Tourism Governors* can access place creation onto the system.
  - *Sellers* can list products, manage bookings, and view sales performance.
  - *Admins* have full control, overseeing system settings, user management, and the overall operation of the platform.

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

### User Authentication
```javascript
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const Tourist = require('../models/Tourist')
const Admin = require('../models/Admin')
const Advertiser = require('../models/Advertiser')
const Seller = require('../models/Seller')
const TourGuide = require('../models/Tourguide')
const TourismGovernor = require('../models/TourismGovernor')

async function login(req, res) {
    const { UserName, Password } = req.body
    if (!UserName || !Password) return res.status(400).json({ 'message': 'All Fields Must Be Given!' })

    const foundUser = await User.findOne({ UserName }).lean().exec()
    if (!foundUser) return res.status(400).json({ 'message': 'User Not Found!' })

    if (foundUser.RequestDelete) return res.status(400).json({ 'message': 'User Requested To Delete!' })

    const correctPwd = await bcrypt.compare(Password, foundUser.Password)
    if (!correctPwd) return res.status(400).json({ 'message': 'Password Is Wrong!' })


    let user
    if (foundUser.Role === 'Tourist') user = await Tourist.findOne({ UserId: foundUser._id }, "_id").lean().exec()
    else if (foundUser.Role === 'Admin') user = await Admin.findOne({ UserId: foundUser._id }, "_id").lean().exec()
    else if (foundUser.Role === 'Advertiser') user = await Advertiser.findOne({ UserId: foundUser._id }, "_id Accepted").lean().exec()
    else if (foundUser.Role === 'Seller') user = await Seller.findOne({ UserId: foundUser._id }, "_id Accepted").lean().exec()
    else if (foundUser.Role === 'TourGuide') user = await TourGuide.findOne({ UserId: foundUser._id }, "_id Accepted").lean().exec()
    else if (foundUser.Role === 'TourismGovernor') user = await TourismGovernor.findOne({ UserId: foundUser._id }, "_id").lean().exec()


    const accessToken = jwt.sign(
        {
            "user": {
                "userId": foundUser._id,
                "id": user._id,
                "email": foundUser.Email,
                "username": foundUser.UserName,
                "role": foundUser.Role,
                "accepted": user.Accepted
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1m' }
    )

    const refreshToken = jwt.sign(
        {
            "email": foundUser.Email
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '30d' }
    )
    console.log({ ...foundUser, userId: foundUser._id, _id: user._id, accepted: user.Accepted })
    console.log(user)
    res.status(200).json({ accessToken, refreshToken, user: { ...foundUser, userId: foundUser._id, _id: user._id, accepted: (foundUser.Role === 'Advertiser' || foundUser.Role === 'Seller' || foundUser.Role === 'TourGuide') ? user.Accepted : true } })
}

async function refresh(req, res) {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const refreshToken = authHeader.split(' ')[1]

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ Email: decoded.email }).lean().exec()

            let user
            if (foundUser?.Role === 'Tourist') user = await Tourist.findOne({ UserId: foundUser._id }, "_id").lean().exec()
            else if (foundUser?.Role === 'Admin') user = await Admin.findOne({ UserId: foundUser._id }, "_id").lean().exec()
            else if (foundUser?.Role === 'Advertiser') user = await Advertiser.findOne({ UserId: foundUser._id }, "_id Accepted").lean().exec()
            else if (foundUser?.Role === 'Seller') user = await Seller.findOne({ UserId: foundUser._id }, "_id Accepted").lean().exec()
            else if (foundUser?.Role === 'TourGuide') user = await TourGuide.findOne({ UserId: foundUser._id }, "_id Accepted").lean().exec()
            else if (foundUser?.Role === 'TourismGovernor') user = await TourismGovernor.findOne({ UserId: foundUser._id }, "_id").lean().exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "user": {
                        "userId": foundUser._id,
                        "id": user._id,
                        "email": foundUser.Email,
                        "username": foundUser.UserName,
                        "role": foundUser.Role,
                        "accepted": user.Accepted
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1m' }
            )

            res.json({ accessToken, refreshToken, user: { ...foundUser, userId: foundUser._id, _id: user._id, accepted: (foundUser.Role === 'Advertiser' || foundUser.Role === 'Seller' || foundUser.Role === 'TourGuide') ? user.Accepted : true } })
        }
    )
}

async function logout(req, res) {
    res.clearCookie('jwt')
    res.json({ 'message': 'Logged Out Successfully!' })
}

module.exports = {
    login,
    refresh,
    logout
}
```

### Backend Controller
```javascript
const createActivity = async (req, res) => {
  const {
    Name,
    Date: dateString,
    Time: timeString,
    Location,
    Price,
    Categories,
    Tags,
    SpecialDiscounts,
    AdvertiserId,
    Duration,
    Image,
  } = req.body;

  const advertiser = await advertiserModel.findById(AdvertiserId, "UserId");
  if (!advertiser || advertiser.UserId.toString() !== req._id)
    return res.status(400).json({ message: "Unauthorized Advertiser!" });

  try {
    if (!Tags || Tags.length === 0) {
      return res.status(400).json({ message: "Please provide valid tags" });
    }

    if (!Categories || Categories.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide valid categories" });
    }

    const foundTags = await TagModel.find({ _id: { $in: Tags } });
    const foundCategories = await CategoryModel.find({
      _id: { $in: Categories },
    });

    if (foundTags.length !== Tags.length) {
      return res.status(400).json({ message: "One or more Tags are invalid" });
    }
    if (foundCategories.length !== Categories.length) {
      return res
        .status(400)
        .json({ message: "One or more Categories are invalid" });
    }

    let parsedPrice = typeof Price === "string" ? parseInt(Price, 10) : Price;
    let parsedDiscount =
      typeof SpecialDiscounts === "string"
        ? parseInt(SpecialDiscounts, 10)
        : SpecialDiscounts;

    let parsedDate = new Date(dateString);
    let parsedTime = new Date(timeString);

    if (isNaN(parsedDate.getTime()) || isNaN(parsedTime.getTime())) {
      return res.status(400).json({ message: "Invalid date or time format" });
    }

    const newActivity = new activityModel({
      Name,
      Date: parsedDate,
      Time: parsedTime,
      Location,
      Price: parsedPrice,
      CategoryId: Categories,
      Tags,
      SpecialDisc
```
### Frontend Snippet
```javascript
'use client'

import LocationViewer from "@/components/shared/LoactionViewer"
import { Button } from "@/components/ui/button"
import { Callout } from "@/components/ui/Callout"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { fetcher } from "@/lib/fetch-client"
import { EyeIcon, Flag, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ItineraryActions({ itinerary }) {
    const router = useRouter()

    const [view, setView] = useState(false)
    const [flag, setFlag] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleFlagItinerary = async () => {
        setLoading(true)
        try {
            const response = await fetcher(`/itineraries/flag/${itinerary._id}`, {
                method: 'PATCH'
            })
            if (!response?.ok) {
                setLoading(false)
                setError('Failed to flag itinerary')
            }
            else {
                setFlag(false)
                setLoading(false)
                router.refresh()
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <div className="flex items-center justify-center gap-6">
                <div onClick={() => setView(true)} className='flex items-center justify-center gap-1 cursor-pointer'>
                    <EyeIcon size={16} />
                    View
                </div>
                {itinerary?.Inappropriate ? (
                    <div onClick={() => setFlag(true)} className='flex items-center justify-center gap-1 text-red-700 cursor-pointer'>
                        <Flag size={16} fill='#b91c1c' stroke="#b91c1c" />
                        Flagged
                    </div>
                ) : (
                    <div onClick={() => setFlag(true)} className='flex items-center justify-center gap-1 text-red-700 cursor-pointer'>
                        <Flag size={16} stroke="#b91c1c" />
                        Flag
                    </div>
                )}
            </div>
            <Dialog open={view} onOpenChange={setView}>
                <DialogContent>
                    <DialogHeader>
                        <h2 className="text-lg font-bold">{itinerary?.Name}'s Details</h2>
                    </Dia
```

### API Integration
```javascript
import TouristAccount from "@/components/ui/touristAccount";
import { fetcher } from "@/lib/fetch-client";

export default async function Account({ params }) {
  const { id } = params;

  const touristInfoResponse = await fetcher(`/tourists/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((e) => console.log(e));

  if (!touristInfoResponse.ok) throw new Error("Network response was not ok");

  const touristInfo = await touristInfoResponse.json();

  return <TouristAccount params={{ touristInfo }} />;
}
```

### Notification Setup Snippet
```javascript
class NotificationService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async createNotification(data) {
        try {
            const notification = new Notification(data);
            await notification.save();

            socket.emit(data.UserId.toString(), 'newNotification', notification);

            return notification;
        } catch (error) {
            throw error;
        }
    }

    async getNotifications(UserId, page = 1, limit = 10) {
        try {
            const notifications = await Notification.find({ UserId })
                .sort({ createdAt: -1 })
                .skip((
```
### JWT Verification
```javascript
const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]
    
    if(process.env.ACCESS_TOKEN_SECRET)
    {
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                if (err) return res.status(403).json({ message: 'Forbidden' })
                if (typeof decoded === 'object' && decoded !== null) {
                    const user = decoded.user;
                    if (user && typeof user === 'object' && 'username' in user && 'role' in user)
                    {
                        req._id = decoded?.user?.userId
                        req.role = decoded?.user?.role

                        next()
                    }
                        
                }
            }
        )
    }
}

module.exports = verifyJWT
```

## Installation

**Clone the project**

```bash
  git clone https://github.com/Advanced-computer-lab-2024/Tripify2.git
```

**Go to the project directories**

- Frontend
```bash
  cd client
```
- Backend
```bash
  cd server
```
Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

**Setup Environment Variables**

- Frontend
```env
API_SERVER_ENDPOINT= https://your-backend.com
NEXT_PUBLIC_API_SERVER_ENDPOINT= https://your-backend.com
NEXTAUTH_URL= https://your-frontend.com
NEXTAUTH_SECRET= your-next.js-secret-auth-key
NEXT_PUBLIC_GOOGLE_API_KEY= your-google-maps-api-key
UPLOADTHING_TOKEN= your-uploadthing-api-key
NEXT_PUBLIC_FRIGADE_API_KEY= your-fridage-api-key
```

- Backend
```env
MONGODB_URI= your-mongodb-api-key
ACCESS_TOKEN_SECRET= your-access-token-key
REFRESH_TOKEN_SECRET= your-refresh-token-key
STRIPE_SECRET_KEY= your-stripe-api-key
CLIENT_URL= https://your-frontend.com
STRIPE_ENDPOINT_SECRET= your-stripe-api-key
HOTEL_API_KEY= your-hotels-api-key
HOTEL_API_SECRET= your-hotels-api-key
FRONTEND_URL= https://your-frontend.com
EMAIL_USER= your-email
EMAIL_PASSWORD= your-password
```

**API server endpoint for frontend to communicate with the backend**
  - API_SERVER_ENDPOINT = https://your-backend.com 

**Public API server endpoint for client-side access (for public APIs)**
  - NEXT_PUBLIC_API_SERVER_ENDPOINT = https://your-backend.com 

**URL for authentication callback (used by NextAuth.js)**
  - NEXTAUTH_URL = https://your-frontend.com 

**Secret key used by NextAuth.js for token encryption (keep it secure)**
  - NEXTAUTH_SECRET = your-next.js-secret-auth-key 

**Google API key for accessing Google Maps or other Google services**
  - NEXT_PUBLIC_GOOGLE_API_KEY = your-google-maps-api-key 

**API key for UploadThing (file upload service)**
  - UPLOADTHING_TOKEN = your-uploadthing-api-key 

**API key for Frigade service (used for specific integrations, e.g., payments or other services)**
  - NEXT_PUBLIC_FRIGADE_API_KEY = your-frigade-api-key 

**MongoDB URI for connecting to your database**
  - MONGODB_URI = your-mongodb-api-key 

**Secret used for signing access tokens (keep this safe and secret)**
  - ACCESS_TOKEN_SECRET = your-access-token-key 

**Secret used for refreshing access tokens (keep this safe and secret)**
  - REFRESH_TOKEN_SECRET = your-refresh-token-key 

**Secret key for Stripe payments integration**
  - STRIPE_SECRET_KEY = your-stripe-api-key 

**Client URL, used for redirecting users to the frontend after authentication or actions**
  - CLIENT_URL = https://your-frontend.com 

**Stripe endpoint secret used for verifying webhook events from Stripe**
  - STRIPE_ENDPOINT_SECRET = your-stripe-api-key 

**API key for accessing hotel-related data (hotel booking service)**
  - HOTEL_API_KEY = your-hotels-api-key 

**Secret key for the hotel API (used in some cases for authentication with hotel services)**
  - HOTEL_API_SECRET = your-hotels-api-key 

**Frontend URL for various purposes, such as redirects or linking in emails**
  - FRONTEND_URL = https://your-frontend.com 

**Email credentials for sending emails from your backend (e.g., for notifications, password resets)**
  - EMAIL_USER = your-email 
  - EMAIL_PASSWORD = your-password

## API Refrences

## Tests

## How to use
All steps are after the set up mentioned above

### Registration
 *Click the Join Our Community button or the Sign-up button on your dashboard, Emails and Usernames must be unique*

**Tourist** 
  - Provide your desired username, email, password, etc...
  - Submit the form to grant account creation
**Tourguide, Advertiser and Seller**
  - Provide your desired username, email, password, a minimum of 2 documents
  - Submit the form and await your admin's approval

### Login
*Click the Sign-in button on your dashboard*

**Enter your Username**

**Enter your Password**
  - If you have forgotten your password, the **Forgot Password** button can help!

### Dashboard
**Tourists and Guests**
  - User-Friendly Interface: Enjoy an intuitive dashboard with a helpful guide to get started quickly.
  - Seamless Access to Itineraries and Attractions: Easily view and book registered itineraries, tourist attractions, and activities, along with exclusive deals you won't find anywhere else.
  - Effortless Trip Planning: Navigate through the dashboard with simple, easy-to-learn controls, making it easier than ever to plan your perfect trip.

**Advertisers, Tourguides, Sellers and Tourism Governors**
  - Straightforward Dashboard: Access a no-fuss dashboard designed for quick creation of itineraries, activities, products, and tourist locations.
  - Comprehensive Reports: Track your performance with detailed reports on sales and bookings, helping you monitor success and adjust strategies effectively.

**Admins**
  - Complete Control: Admins are provided with an all-encompassing dashboard to manage the platform's overall functionality.
  - User Management: Easily manage and oversee user accounts, ensuring smooth operations across all user types.
  - Data-Driven Decisions: Access in-depth analytics and reports, including user behavior, traffic, and engagement metrics, enabling informed decision-making for platform improvements.
  - Content Moderation: Admins have the ability to approve or manage content, ensuring the quality and accuracy of information provided on the platform.

## Contribute
*We are actively working on*
  - Improved User Experience: Making the platform more intuitive for all user types.
  - Enhanced Reporting: Expanding the reporting features for better insights and decision-making.
  - Bug Fixes and Optimizations: Regularly addressing any bugs and improving overall system performance.
  - AI Integration: Exploring and integrating AI capabilities to further enhance the platform's functionality.

*To contribute*
  - **Clone the Repository**
  - **Create a Branch**
  - **Code your Changes**
  - **Commit and Push**
  - **Submit a Pull Eequest**

*We are very keen on fixing community found bugs*

  - We highly encourage contributions from the community! If you find a bug or have an idea for an improvement, feel free to submit a pull request. Your input helps make the project even better.

## Credits

- **Documentation**
  - [Express.js Documentation](https://expressjs.com/en/5x/api.html)
  - [MongoDB Documentation](https://www.mongodb.com/docs/)
  - [Node.js Documentation](https://nodejs.org/docs/latest/api/)
  - [Tailwindcss Documentation](https://tailwindcss.com/docs)
  - [Frigade Documentation](https://docs.frigade.com/v2/component/overview)
  - [React.js Documentation](https://legacy.reactjs.org/docs/getting-started.html)
  - [Next.js Documentation](https://nextjs.org/docs)

- **Tutorials**
  - [Next.js Tutorials](https://www.youtube.com/@javascriptmastery)
  - [Node.js / Express.js Tutorials](https://www.youtube.com/@DaveGrayTeachesCode)
  - [React.js Tutorials](https://www.youtube.com/@freecodecamp)

- **JavaScript and Logic**
  - [Tutorials](https://www.w3schools.com/js/)
  - [Community](https://stackoverflow.com/)

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). 

### Third-Party Licenses

This project uses third-party libraries and services that are subject to their own licenses:
- **MongoDB**: Subject to the [MongoDB Server Side Public License](https://www.mongodb.com/licensing/server-side-public-license).
- **Stripe**: Licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0).
- **React.js**: Licensed under the [MIT License](https://github.com/facebook/react/blob/main/LICENSE).
