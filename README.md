# The Shoppies
### An app to manage the nominations for the upcoming Shoppies!
---------------
## Project writeup

#### Problem/ opportunity
I built this app to collect nominations from Shopifolk for the upcoming Shoppies. Each Shopifolk could nominate up to 5 movies but they could only nominate a movie once. I started this project by thinking about what an award nomination app should look like and what it would need to do. I decided there needed to be a section where people could search for a movie, a section to display the search results, and a final section to display the list of movies they’ve nominated. I would also need to add a button to the search results to nominate them and a button to the nominated movies in case they want to un-nominate a movie to pick another. The nomination button would also have to be removed or disabled on already nominated search results so that the same movie couldn’t be nominated twice and there would need to be some way to save this data.

#### Process and solution
While thinking about the design, I set up a new folder with a basic file structure for the app, initialized git for the project, and connected it to Github. I understand and appreciate the need for design tools like Figma but my personal preference is to rapidly build prototypes in the browser and iterate on them like a sculpture chipping away at a slab of marble. After the app’s folder was set up I layed out the headings at the top of the app and the 3 main content boxes to form the skeleton of the app.

Next, I built the javascript functionality to get and display the movies for any search result and built a rough draft of the movie listing component which would be in the search results and in the list of nominated movies. From there I had to build out more javascript functionality that would display the list of nominated movies and empower Shopifolk to un-nominate a movie.

Once the necessary functionality was built, I went deep into iterating on the style of the app and refactoring the existing code. I also added additional features that improved the experience of the app like how the movie moves from the search list to the nominated list when you click the nominate button.

To validate the effectiveness of my app, I’ll ask a group of colleagues to give it a try. Ideally, they would be recording their screen or sharing their view through something like Google Meets so I could watch them use the app to observe if there are any sticking points that I didn’t anticipate. From there I would also collect their feedback on the app, document my learning, hypothesize about how it could be better, iterate on the design, and repeat. I will also setup a tool like Google Analytics to track usability data quantitatively.

#### Reflection
The biggest challenge I encountered while building this project was a javascript scoping issue that I hadn’t encountered before. I was stuck and at the end of my technical abilities so I reached out to a more experienced colleague of mine and we hopped into Tuple, a pair programming tool, and talked out the problem and eventually figured it out. I also want to add a loading animation to the nominated movie list however, I’ve found that the results load one by one with the loading animation in the background and I haven’t found a way to display all the results and remove the animation in one go.
