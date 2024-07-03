const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog, blogs, createInitialBlogs, getNewBlog } = require("./helper");

describe('Blog app', () => {
    // Reset the blogs and users collections in test database and create user
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai',
                password: 'salainen'
            }
        })
        // Initial blogs length is 6 and are created by "testUser"
        await createInitialBlogs(request, blogs);
        await page.goto('/')
    })

    test('Login form is shown', async ({ page }) => {
        const loginFormTitle = await page.getByText("Log in to application");
        const usernameInput = page.getByTestId("username-input");
        const passwordInput = page.getByTestId("password-input");
        const submitButton = page.getByText("Submit");

        await expect(loginFormTitle).toBeVisible();
        await expect(usernameInput).toBeVisible();
        await expect(passwordInput).toBeVisible();
        await expect(submitButton).toBeVisible();
    })
    describe("Login", () => {
        test("succeeds with correct credentials", async ({ page }) => {
            await loginWith(page, "mluukkai", "salainen");
            await expect(page.getByText("mluukkai logged in")).toBeVisible();
            await expect(page.getByText("new blog")).toBeVisible();
        })
        test("fails with incorrect credentials", async ({ page }) => {
            await loginWith(page, "wrong", "credentials");
            const notification = page.getByTestId("notification")
            await expect(notification).toBeVisible()
            await expect(notification).toHaveText("Login failed");
            await expect(notification).toHaveCSS("border", "2px solid rgb(255, 0, 0)");
        })
    })
    describe("When logged in with initial blogs", () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, "mluukkai", "salainen");
        })
        test("initial blogs are visible", async ({ page }) => {
            const loggedInUser = await page.getByText("mluukkai logged in")
            await expect(loggedInUser).toBeVisible()
            for (let i = 0; i < blogs.length; i++) {
                const initialBlog = await page.getByText(blogs[i].title);
                await expect(initialBlog).toBeVisible();
            }
        })
        test("new blog can be created", async ({ page }) => {
            await createBlog(page, "test title", "new author", "www.newblog.com");
            const notification = page.getByTestId("notification");

            await expect(notification).toBeVisible();
            await expect(notification).toHaveCSS("border", "2px solid rgb(0, 128, 0)");

            const blogs = await page.getByTestId("blog").all();
            const newBlog = await getNewBlog(blogs, "test title");
            const newBlogTitle = await newBlog.getByTestId("blog-title");

            await expect(newBlog).toBeVisible();
            await expect(newBlogTitle).toHaveText("test title");
        })
        test("new blog can be liked", async ({ page }) => {
            await createBlog(page, "test title", "new author", "www.newblog.com");

            const blogs = await page.getByTestId("blog").all();
            const newBlog = await getNewBlog(blogs, "test title");

            const newBlogViewButton = await newBlog.locator("button", { hasText: "view" })
            await newBlogViewButton.click();

            const newBlogLikeButton = await newBlog.locator("button", { hasText: "like" });
            await newBlogLikeButton.click();

            // const likesDiv = await newBlog.locator("div", { hasText: "likes" });
            const newBlogLikes = await newBlog.getByTestId("blog-likes").textContent();
            expect(parseInt(newBlogLikes)).toBeGreaterThan(0);
        })
        test("new blog can be deleted", async ({ page }) => {
            // Will answer "true" to window.confirm query when remove button is clicked
            page.on("dialog", async dialog => {
                if (dialog.type() === "confirm") {
                    await dialog.accept();
                }
            })
            await createBlog(page, "test title", "test author", "www.testurl.com");

            const blogs = await page.getByTestId("blog").all();
            const newBlog = await getNewBlog(blogs, "test title");

            const newBlogViewButton = await newBlog.locator("button", { hasText: "view" })
            await newBlogViewButton.click();

            const newBlogRemoveButton = await newBlog.locator("button", { hasText: "remove" });
            await newBlogRemoveButton.click();

            // Wait until newBlog has been removed from the page
            await newBlog.waitFor({ state: "detached" });
            expect(newBlog).not.toBeVisible();
        })
        test("logged in user should see remove button only for blogs they added", async ({ page }) => {
            await createBlog(page, "test title", "new author", "www.newblog.com");
            const blogs = await page.getByTestId("blog").all();

            // Loop through the blog list and click view buttons
            for (const blog of blogs) {
                const blogViewButton = blog.locator("button", { hasText: "view" });
                const blogRemoveButton = blog.locator("button", { hasText: "remove" });
                const blogTitle = await blog.getByTestId("blog-title").textContent();

                await blogViewButton.click();
                if (blogTitle === "test title") {
                    await expect(blogRemoveButton).toBeVisible();
                } else {
                    await expect(blogRemoveButton).not.toBeVisible();
                }
            }
        })
        test("blogs are sorted in descending order of likes", async ({ page }) => {
            let likesArray = [];
            const blogs = await page.getByTestId("blog").all();

            // Isolate the likes value from the elements in order they appear on the list
            for (const blog of blogs) {
                const blogLikes = await blog.getByTestId("blog-likes").textContent();
                likesArray.push(parseInt(blogLikes));
            }

            // Compare that numbers in likes array are in descending order
            const checkIsArraySorted = (array) => {
                // Stop the comparison at the second last item 
                for (let i = 0; i < array.length - 1; i++) {
                    if (array[i] < array[i + 1]) {
                        return false
                    }
                }
                return true
            }
            const arrayIsSorted = checkIsArraySorted(likesArray);
            expect(arrayIsSorted).toBe(true);
        })
    })
})