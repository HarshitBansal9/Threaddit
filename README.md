<h1>Threaddit</h1>
<p>AA threads/reddit clone in which users can create public posts,create private rooms and much more</p>

<h2>How it Works:</h2>
<div>
  1.First sign in using your google account.
  <h1></h1>
  ![image](https://github.com/user-attachments/assets/4fa0107d-fa75-47f4-abda-c6d98da783e0)

  2.Navigate to the home page where you can already see a few public posts.
  3.Create a post yourself.
![image](https://github.com/user-attachments/assets/9e5dfa20-c92d-4287-b523-b08a1cd24ea2)

  4.Navigate to the rooms page and create your own private room with other users and chat!
  ![image](https://github.com/user-attachments/assets/747086e7-9fba-4f42-af67-cbf3d5099f8a)

</div>

<h2>Made Using:
<ul>
  <li>React Typescript</li>
  <li>Express/NodeJS</li>
  <li>Postgres</li>
  <li>Docker</li>
</ul>
</h2>

<h2>
  <ul>
    <li>Clone the repository and run npm i in the client/threaddit and server folders</li>
    <li>In the server folder,create a .env file with these values:
            DB_HOST=db
      DB_DB=postgres
      DB_PORT=5432
      DB_PASSWORD=postgres
      DB_USER=postgres
      
      REDIS_HOST=redis
      REDIS_PORT=6379
      
      GOOGLE_CLIENT_ID = ""
      GOOGLE_CLIENT_SECRET = ""
      
      JWT_SECRET = "dfknefklnfk"
      
      UI_ROOT_URL = "http://localhost:5173"
    </li>
    <li>cd server folder sudo docker-compose up</li>
    <li>open another terminal and cd to client/threaddit and run npm run dev</li>
  </ul>
</h2>

