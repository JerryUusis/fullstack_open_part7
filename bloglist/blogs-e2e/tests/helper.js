const loginWith = async (page, username, password) => {
    const usernameInput = page.getByTestId("username-input");
    const passwordInput = page.getByTestId("password-input");
    const submitButton = page.getByText("Submit");
    await usernameInput.fill(username);
    await passwordInput.fill(password);
    await submitButton.click();
}

const createBlog = async (page, title, author, text) => {
    const newBlogButton = await page.getByRole('button', { name: 'new blog' });
    await newBlogButton.click();

    const titleInput = await page.getByTestId("title-input");
    const authorInput = await page.getByTestId("author-input");
    const urlInput = await page.getByTestId("url-input");

    await titleInput.fill(title);
    await authorInput.fill(author);
    await urlInput.fill(text);

    const submitButton = await page.getByText("create");
    await submitButton.click();

    const blog = await page.getByTestId("blog");
    const newBlogTitle = await blog.locator("span", { hasText: title });
    await newBlogTitle.waitFor();
}

// Used to get the newly created blog
const getNewBlog = async (blogs, blogTitle) => {
    for (const blog of blogs) {
        const blogTextContent = await blog.textContent();
        if (blogTextContent.includes(blogTitle)) {
            return blog;
        }
    }
}

const blogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5
    },
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12
    },
    {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10
    },
    {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0
    },
    {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2
    },
];


const createInitialBlogs = async (request, blogs) => {

    // Create a user, login and post blogs
    const testUser = {
        data: {
            username: "testUser",
            name: "test user",
            password: "test1234"
        }
    }
    // Create new user
    await request.post("/api/users/", testUser);

    // Login with the created user
    const loginResponse = await request.post("/api/login", {
        data: {
            username: "testUser", password: "test1234"
        }
    });

    // Turn JSON string into JS object
    const loginData = await loginResponse.json();
    // Extract token from login response
    const token = loginData.token;
    for (const blog of blogs) {
        await request.post("/api/blogs", {
            data: blog,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
    }
}



module.exports = { loginWith, createBlog, blogs, createInitialBlogs, getNewBlog }