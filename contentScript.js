const onButtonTrigger = (info, container) => {
	const newDiv = document.createElement("div");
	newDiv.innerText = info.content;
	container.append(newDiv);
};

// create the Widget UI here
const insertWidget = (info) => {
	const container = document.createElement("div");
	container.setAttribute("class", "plugin-container");
	container.style.background = "yellow";
	const newEle = document.createElement("h1");
	newEle.innerText = "This is the plugin for " + info.user;
	const newBtn = document.createElement("button");
	newBtn.innerText = "Button";
	newBtn.addEventListener("click", () => {
		onButtonTrigger(info, container);
	});
	container.append(newEle);
	container.append(newBtn);
	return container;
};

// pull the content, user, isQuote from the tweet DOM
const pullPerTweet = (wrapper) => {
	const tweet = wrapper.querySelectorAll('[data-testid="tweet"]')[0];

	const user = tweet
		?.getElementsByTagName("a")[0]
		.getAttribute("href")
		.replace("/", "@");

	const body = tweet?.lastChild?.lastChild;
	const content = body?.childNodes[0].innerText;
	const attachment = body?.childNodes[1];

	const isQuote = attachment?.innerText.startsWith("Quote Tweet");
	const meta = body?.childNodes[2].getAttribute("aria-label");
	const tweet_info = { user, content, isQuote, meta };
	if (isQuote) {
		const isExist = tweet.parentElement.querySelectorAll(
			".plugin-container"
		);
		if (isExist.length === 0) {
			const newWidget = insertWidget(tweet_info);
			tweet.parentNode.append(newWidget);
		}
	}
};

// pull the tweet list DOM
const pullContent = () => {
	const content = document.getElementsByTagName("main")[0];
	const list_tag = content.getElementsByTagName("section")[0];
	const tweet_list = list_tag.lastChild.childNodes[0];

	tweet_list.childNodes.forEach(pullPerTweet);
};

let timer = null;


// refresh the content whenever a user stops scrolling the page
document.addEventListener("scroll", () => {
	if (timer !== null) {
		clearTimeout(timer);
	}
	timer = setTimeout(function () {
		pullContent();
	}, 150);
});
