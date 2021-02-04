to test the studio while developing, make a symlink inside the /studio/plugins that links to the root directory. 

Create a sanity bot token with write access at manage.sanity.io. Then make a .env file with at the root:

```
SANITY_PLAYWRIGHT_TEST_TOKEN=<SANITY_WRITE_API_TOKEN>
SANITY_PROJECT_ID=<PROJECT_ID>
```