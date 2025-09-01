# Making a terrace watering system - overview


## Introduction

Having a terrace watering system is probably more of a statement than a practicality. Few pots or raised beds of vegetables won't feed you over the year but they can feel like a small act of resistance against mass-produced non-organic food that we encounter everyday. Furthermore, there's something special in harvesting your own food, even if this means stepping on the terrace and picking few ripe cherry tomatoes. But no matter how small the garden is, to make it happen, some nurturing must be provided and this includes regular watering. Also, garden isn't only about effort - it's about continuity - being away from it for a week or two during the summer could have devastating effect on the plants. The simplest solution for this problem could be a friendly neighbour who's not away. But let's say that this option isn't always available. Enter IoT and watering automation.

The mentioned situation was the catalyst for this project although I considered it before the 'problem' came to existence. Immediately after I got my first Raspberry Pi, watering automation was one of the 'archetypal' Pi projects that got my attention. I liked the idea of coding to control something physical, it felt for me a bit like magic. And as I was still figuring out how to do it I got small donation of parts that could be used for watering that would otherwise be sitting in a box, gathering dust in the basement. Among them were Arduino Uno and NodeMCU ESP8266 boards, YL69 moisture sensors, double relay, solvenoid valve and water pump. Until that moment I didn't really consider using Arduino, but now that I had it, new idea emerged - Raspberry Pi will host web application that will serve as a dashboard for wireless control over Arduino-relay-pump watering system. Also, I had a time frame - I decided to try to make it in about a month, so I can use it during vacation (if there will be need).

## Gathering ideas and implementation

Since I was going to use what I had, first I investigated a bit to see how to wire Arduino with sensor and with pump and relay to see if all the parts work and after that I started thinking about web server part. I came up with the following idea:

1. Dashboard will show devices (pumps, sensors) as cards with settings details and latest logs and will provide a way to change settings
2. In the case of pump there should be automatic/manual way to start watering
3. Backend will store devices (with settings) and device logs in the database
4. events will be used as a way of communication between devices and web server (e.g. watering command will be sent to some topic, pump will consume it and check by ID if the event is relatable; on the other hand - if the watering starts or ends, pump will also publish event that will be then consumed by web server)
5. REST API will be used to load data to frontend, but events (SSE) will be sent to dynamically update it (e.g. when watering is done)

Additionally:

- web server should run in container
- there should be a script that will install Docker and run the server so the setup is as simple as possible
- there should be a way to setup simple CD (continuous delivery) flow, so when new commit is pushed on GitHub the application is redeployed with the newest changes

After testing Arduino with sensor and then with pump and relay, this part proved to be fairly simple, while the code on Arduino was waiting for fine-tuning after the web server is ready. So I started with web server. Initial idea proved to be overwhelming - it was too much to do all at once and I decided to first make the server that will communicate via serial port with Arduino and then to gradually build towards initial idea. Eventually, I had some kind of MVP that was starting pump by clicking button on frontend. The web server part is still work in progress and it will probably stay that way - but I got to the point that I can check all the initial idea 'boxes'. On the other hand, in process I gave up from some features/improvements that I wanted to include:

- Battery-powered sensors sending periodically data about plant moisture proved to be useless because readings were unreliable. Also I found out that commercial solution don't use these kinds of things (sometimes sensors are used to check if it was raining to skip the watering) as they mostly provide a way to set watering interval.
- I intended to use solvenoid valves to control watering of specific plant groups but I dropped it because it seemed like an overkill for terrace garden and additional complication was that the valve that I got was for incompatible hose diameter.

Although the web app was ready for some time, I was able to make the watering work only few days before vacation because I was waiting for hoses and hose splitters, because it was complicated to get themdelivered on short notice.

It worked great 8)

## Further thoughts

Since I'm web developer, creating the web application for remote control of the watering system was the most interesting part for me, or at least the part in which I was most involved. I was trying some ideas and made the solution more complicated than it needed to be - I really didn't need to make things modular and to support more pumps and sensors because I only had one pump. But that was for the sake of learning and trying. Also, for this kind of project Raspberry Pi could be omitted completely. In this scenario Arduino itself would control the pump, watering would be done in predefined interval and between waterings the system would go to sleep. It's maybe the most economic solution. Improvement can be adding some buttons and LED display to set the timer. If one still opts for some kind of centralized server, there are solutions for that also (Home Assistant). But reinventing the wheel was kind of the point here.

And now, a moment of candor - the project was't done only by myself, as I used ChatGPT to generate some code and to speed up a process of development. In the background of this help stands the work of other people on the web, and using it maybe shouldn't feel different then (e.g.) using Stack Overflow. But it feels different. So, despite idea, architecture and tech-stack decisions are mine, I feel a bit uneasy because of using AI and want to elaborate on this a bit. Using ChatGPT made me quicker - I wouldn't probably made this by deadline without it. That's fine, but uneasy part comes from potential passivity that comes along with it. For example, I deliberately chose to use some libraries that I don't use often and this was also slowing me down. Then I tried to speed up the process by getting some code from ChatGPT. The question arises what's the point of trying something new if there's no effort.

I like to think that I wasn't that passive in the process, I was debugging, rewriting some code, thinking about alternatives and so on. As for new technologies/libraries, I was exposed to something new in a hands-on way and this should help in my further using of these things. But I strongly believe that one shouldn't skip documentation and 'digging'. Coding by myself first (but not hesitating to use available tools) is the way I think that I will learn the most while retaining the sense of authenticity and pride in one's work. So further steps for me in this project can be to digest and refactor the code that I didn't write directly and make improvements without the aid. One of the side-goals of this project is to get production-ready Node.js/Express backend template and this is something where I can practice mentioned approach.


## Conclusion

There are commercial automated watering solutions that are affordable, but making this project wasn't just about watering. Like a small terrace garden, it's probably more of a statement in a world of ready-made solutions. Also, a little bit of DIY can feel empowering, teach a new skill or knowledge, it can provide joy of making something that works and so on. The water pump works and there are lots of things that I could improve. I'll probably do something from time to time, but initial goal was done. It's great to see that it works, although the whole thing seems too complicated. It's because of this maybe unnecessary complexity that I feel ambiguous towards home automation. I don't say that it can't get practical, but in this case I would still recommend to put some faith in thy friendly neighbour :)
