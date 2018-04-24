function generateTest(){
  var imageTabsDiv = document.getElementById('imageTabs');
  if(imageTabsDiv !== null) imageTabsDiv.parentNode.removeChild(imageTabsDiv);

  var numQuestions = 20;
  var questions = Array.apply(null, {length: 125}).map(Number.call, Number)
  var randomQuestions = shuffle(questions)

  var imageTabsDiv = document.createElement('div');
  imageTabsDiv.setAttribute('id', 'imageTabs');

  for (var i = 0; i < numQuestions; i++) {
    var q = document.createElement("div");
    q.classList.add("question");
    var qNum = questions[i]+1;

    var img = document.createElement("img");
    img.classList.add("qImg");
    img.src =  ("/questions/"+qNum+".png");
    var ans = document.createElement("img");
    ans.classList.add("aImg");
    ans.classList.add("answerHide");
    ans.src =  ("/answers/"+qNum+".png");

    q.appendChild(img);
    q.appendChild(ans);
    imageTabsDiv.appendChild(q);
  }
  document.getElementById("testPlaceholder").appendChild(imageTabsDiv);
  stopwatch.start()
}

function toggleAnswers(){
  if(document.getElementById("answerButton").innerText == "Show Answers"){
    sources = document.getElementsByClassName("aImg");
    for (var i = sources.length - 1; i >= 0; i--) {
      sources[i].classList.remove("answerHide");
      sources[i].classList.add("answerShow");
    }
    document.getElementById("answerButton").innerText = "Hide Answers";
  }
  else if(document.getElementById("answerButton").innerText == "Hide Answers"){
    sources = document.getElementsByClassName("aImg");
    for (var i = sources.length - 1; i >= 0; i--) {
      sources[i].classList.remove("answerShow");
      sources[i].classList.add("answerHide");
    }
    document.getElementById("answerButton").innerText = "Show Answers"
  }
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

class Stopwatch {
    constructor(display, results) {
        this.running = false;
        this.display = display;
        this.results = results;
        this.laps = [];
        this.reset();
        this.print(this.times);
    }
    
    reset() {
        this.times = [ 0, 0, 0 ];
    }
    
    start() {
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
    }
    
    lap() {
        let times = this.times;
        let li = document.createElement('li');
        li.innerText = this.format(times);
        this.results.appendChild(li);
    }
    
    stop() {
        this.running = false;
        this.time = null;
    }

    restart() {
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
        this.reset();
    }
    
    clear() {
        clearChildren(this.results);
    }
    
    step(timestamp) {
        if (!this.running) return;
        this.calculate(timestamp);
        this.time = timestamp;
        this.print();
        requestAnimationFrame(this.step.bind(this));
    }
    
    calculate(timestamp) {
        var diff = timestamp - this.time;
        // Hundredths of a second are 100 ms
        this.times[2] += diff / 10;
        // Seconds are 100 hundredths of a second
        if (this.times[2] >= 100) {
            this.times[1] += 1;
            this.times[2] -= 100;
        }
        // Minutes are 60 seconds
        if (this.times[1] >= 60) {
            this.times[0] += 1;
            this.times[1] -= 60;
        }
    }
    
    print() {
        this.display.innerText = this.format(this.times);
    }
    
    format(times) {
        return `\
${pad0(times[0], 2)}:\
${pad0(times[1], 2)}`;
    }
}

function pad0(value, count) {
    var result = value.toString();
    for (; result.length < count; --count)
        result = '0' + result;
    return result;
}

function clearChildren(node) {
    while (node.lastChild)
        node.removeChild(node.lastChild);
}

let stopwatch = new Stopwatch(
    document.querySelector('.stopwatch'),
    document.querySelector('.results'));