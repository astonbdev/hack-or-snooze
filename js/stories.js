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

  for(let favStory of currentUser.favorites){
    if(favStory.storyId === story.storyId){
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

function makeNewStory(e) {}

$($storySubmitForm).on("submit", submitAndDisplayStory);

/** Formats form data into obj of {title, author, id} with 
 * values from form, and calls addStory() from storyList 
 * to generate Story from server. Finally, generates markup 
 * with new story and appends to $allStoriesList
 */
async function submitAndDisplayStory(e) {
  e.preventDefault();
  
  /* Works but do not understand
  const data = new FormData(e.target);
  console.log(data.entries());

  const value = Object.fromEntries(data.entries());

  console.log(value);
  */

  [{author: "Brian"} , {}]

  const formData = $storySubmitForm
    .serializeArray()
    .map((obj) => { 
      //working
      const newObj = {};
      newObj[obj.name] = obj.value;
      return newObj;
    });

    /*
    const storyObj = {
      author : formData[0]["author"], 
      title: formData[1]["title"], 
      url: formData[2]["url"]
    };
    */

    const storyObj = formData.reduce((prevVal, obj) => {
      let objKeys = Object.keys(obj);
      prevVal[objKeys[0]] = obj[objKeys[0]];
      return prevVal;
    });

    const storyInstance = await storyList.addStory(currentUser, storyObj);
    //console.log("storyInstance URL: " + storyInstance.url);
    //console.log(storyInstance);
    //unshift story to mem js
    $allStoriesList.prepend(generateStoryMarkup(storyInstance));
    hidePageComponents();
    $allStoriesList.show();
  }