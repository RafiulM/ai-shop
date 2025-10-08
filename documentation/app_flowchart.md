flowchart TD
  Start[Start] --> Home[Open Home Page]
  Home --> AuthCheck{User Authenticated}
  AuthCheck -->|Yes| Products[View Product Listing]
  AuthCheck -->|No| Products
  Products --> ProductDetail[View Product Detail]
  ProductDetail --> AddCart[Add Product to Cart]
  AddCart --> Cart[View Cart]
  Cart --> Checkout[Proceed to Checkout]
  Checkout --> AuthCheck2{User Authenticated}
  AuthCheck2 -->|Yes| Payment[Enter Payment Information]
  AuthCheck2 -->|No| Login[Login or Signup]
  Login --> Checkout
  Payment --> Confirmation[Order Confirmation]
  Confirmation --> End[End]

  Home --> Chat[Open Chat Widget]
  Chat --> ChatAPI[Call Chat Api]
  ChatAPI --> ChatResponse[Receive Ai Response]
  ChatResponse --> Chat

  AdminEntry[Admin Section] --> AdminAuth{Admin Authenticated}
  AdminAuth -->|Yes| AdminDash[Admin Dashboard]
  AdminAuth -->|No| AdminLogin[Admin Login]
  AdminLogin --> AdminAuth
  AdminDash --> ManageProducts[Manage Products]
  AdminDash --> ManageOrders[Manage Orders]
  AdminDash --> Analytics[View Analytics]
  AdminDash --> AdminEnd[End]