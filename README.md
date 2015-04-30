# Glance

## Installation Instructions
1. Clone this repo to your web server with MySQL and PHP installed.
2. Create a MySQL database called `video_coding`.
3. Set up your MySQL database using the provided `schema.sql` file. `mysql -u [USERNAME] -p[PASSWORD] video_coding < schema.sql`
4. Update `getDB.php` with your MySQL username and password.

## Usage Instructions
1. Navigate to `setup/index.php` using the latest version of Chrome.
2. At the top left, load the YouTube video that you wish to code by entering its full URL.
3. On the right, tell workers what action and part of the video you wish for them to code. Create a unique session name.
4. Optionally, click "show advanced options" to choose clip length, percent of the video to be coded, and how many workers should code each clip.
5. Optionally, click the "choose example" button and use the sliders to choose an example video that will show workers what you want coded. Be sure to click "save example" when finished.
6. Click "get labels".
7. Send Mechanical Turk workers to the first link at the center of the page. We reccommend using [LegionTools](https://github.com/RocHCI/LegionTools) to recruit workers.
8. To view and download results, click the second link at the center of the page.

# Authors
* [Mitchell Gordon](http://mgordon.me/ "Mitchell Gordon")
* [Walter S. Lasecki](http://wslasecki.com/ "Walter S. Lasecki")
