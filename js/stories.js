"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  //used to determin what star css class to add to listed story
  let favoriteStar = "far";
  //console.log("Story: ",story);
  //console.log("Favorites: ", currentUser.favorites);

  for (let favStory of currentUser.favorites) {
    if (favStory.storyId === story.storyId) {
      favoriteStar = "fas";
    }
  }

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <span class="star">
        <i class = "${favoriteStar} fa-star"></i>
      </span
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** From current user's favorite stories, generates their HTML, and puts on page. */

function putFavoriteStoriesOnPage() {
  $favoriteStoriesList.empty();

  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favoriteStoriesList.append($story);
  }
  $favoriteStoriesList.show();
}

/** Formats form data into obj of {title, author, url} with
 * values from form, and calls addStory() from storyList
 * to generate Story from server. Finally, generates markup
 * with new story and appends to $allStoriesList
 */
async function submitAndDisplayStory(e) {
  e.preventDefault();

  let storyObj = {};

  //Extract data
  storyObj.title = $("#title-input").val();
  storyObj.author = $("#author-input").val();
  storyObj.url = $("#url-input").val();

  console.log(storyObj);

  //reset form
  for(let input of $(e.target)){
    input.reset();
  }

  //make server call, and update ui
  const storyInstance = await storyList.addStory(currentUser, storyObj);
  $allStoriesList.prepend(generateStoryMarkup(storyInstance));
  hidePageComponents();
  $allStoriesList.show();
  
}

$($storySubmitForm).on("submit", submitAndDisplayStory);
