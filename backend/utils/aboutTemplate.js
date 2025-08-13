const fs = require('fs').promises;
const path = require('path');

const ABOUT_DATA_FILE = path.join(__dirname, '../data/about.json');
const ABOUT_TEMPLATE_FILE = path.join(__dirname, '../public/about.html');

async function getAboutData() {
    try {
        const data = await fs.readFile(ABOUT_DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading about data:', error);
        return null;
    }
}

async function generateAboutPage() {
    try {
        const aboutData = await getAboutData();
        if (!aboutData) {
            console.log('No about data found, serving static template');
            return await fs.readFile(ABOUT_TEMPLATE_FILE, 'utf8');
        }

        let template = await fs.readFile(ABOUT_TEMPLATE_FILE, 'utf8');

        // Replace hero section content
        if (aboutData.hero) {
            // Replace hero subtitle
            template = template.replace(
                /<p class="text-size-regular text-color-white">Empowering Brand Excellence<\/p>/,
                `<p class="text-size-regular text-color-white">${aboutData.hero.subtitle}</p>`
            );

            // Replace hero description - handle multiline content
            template = template.replace(
                /<p class="text-size-regular text-color-white">We are a premier brand management company[\s\S]*?multiple industries\.<\/p>/,
                `<p class="text-size-regular text-color-white">${aboutData.hero.description}</p>`
            );

            // Replace hero image - use flexible approach to handle any image source
            if (aboutData.hero.image) {
                // Replace any image in the about-hero-image section
                template = template.replace(
                    /<div class="about-hero-image">[\s\S]*?<img[\s\S]*?src="[^"]*"[\s\S]*?class="image-fill"[\s\S]*?\/>/,
                    `<div class="about-hero-image">
                      <div class="about-image-height"></div>
                      <div class="image-overlay"></div>
                      <img src="${aboutData.hero.image}" loading="lazy" alt="Hero image" class="image-fill" />
                    </div>`
                );
            }

            // Replace story title
            template = template.replace(
                /<h3 class="heading-style-h3">Our Story<\/h3>/,
                `<h3 class="heading-style-h3">${aboutData.hero.storyTitle}</h3>`
            );
        }

        // Replace story intro section
        if (aboutData.storyIntro) {
            // Replace story intro title
            template = template.replace(
                /<h2 class="heading-style-h1 text-align-center">Discover Our Brand Portfolio Excellence<\/h2>/,
                `<h2 class="heading-style-h1 text-align-center">${aboutData.storyIntro.title}</h2>`
            );
        }

        // Replace story section
        if (aboutData.story) {
            // Replace story subtitle/mission
            template = template.replace(
                /<p class="text-size-tiny text-style-allcaps text-color-red text-weight-medium">Our<br\/>Mission<\/p>/,
                `<p class="text-size-tiny text-style-allcaps text-color-red text-weight-medium">${aboutData.story.title}</p>`
            );

            // Replace story content - the long paragraph
            template = template.replace(
                /<p class="text-size-regular">At Ventured Brands, we specialize in acquiring[\s\S]*?new heights of success\.<\/p>/,
                `<p class="text-size-regular">${aboutData.story.description}<br/><br/>${aboutData.story.content}</p>`
            );

            // Replace story images - use flexible approach to handle any image sources
            if (aboutData.story.image1 || aboutData.story.image2) {
                // Replace the entire story strip section with dynamic images
                const image1Src = aboutData.story.image1 || 'https://cdn.prod.website-files.com/63f01df7eead46b8df360d90/63f01df7eead469ed8360ed7_Person%20006.webp';
                const image2Src = aboutData.story.image2 || 'images/person-004.webp';
                
                template = template.replace(
                    /<div id="w-node-_0954c621-66b7-be0f-b1ac-7ad6ac03614c-2c360d96" class="about-story-strip">[\s\S]*?<\/div>\s*<\/div>/,
                    `<div id="w-node-_0954c621-66b7-be0f-b1ac-7ad6ac03614c-2c360d96" class="about-story-strip">
                      <div id="w-node-_7bf71e70-5e48-2e8d-39be-445613125019-2c360d96" class="about-story-image">
                        <div class="about-story-height"></div>
                        <div class="image-overlay"></div>
                        <img src="${image1Src}" loading="lazy" alt="Story image 1" class="image-fill" />
                      </div>
                      <div id="w-node-_9dc58098-207c-c5d1-9dc3-e11d39e81c15-2c360d96" data-w-id="9dc58098-207c-c5d1-9dc3-e11d39e81c15" class="about-story-image">
                        <div class="about-story-height"></div>
                        <div class="image-overlay"></div>
                        <img src="${image2Src}" loading="lazy" alt="Story image 2" class="image-fill" />
                      </div>
                    </div>`
                );
            }
        }

        // Replace quote section
        if (aboutData.quote) {
            // Replace quote text
            template = template.replace(
                /<h1 class="text-size-xl text-align-center">"We transform brands into market leaders through strategic excellence"<\/h1>/,
                `<h1 class="text-size-xl text-align-center">"${aboutData.quote.text}"</h1>`
            );

            // Replace quote author
            template = template.replace(
                /<p class="text-size-small text-style-allcaps text-weight-normal">Sarah Mitchell<\/p><img src="images\/bold-star-light\.svg" loading="lazy" alt="" class="quote-star"\/><p class="text-size-small text-style-allcaps text-weight-normal">CEO, Ventured Brands<\/p>/,
                `<p class="text-size-small text-style-allcaps text-weight-normal">${aboutData.quote.author}</p><img src="images/bold-star-light.svg" loading="lazy" alt="" class="quote-star"/><p class="text-size-small text-style-allcaps text-weight-normal">Ventured Brands</p>`
            );
        }

        // Replace team section
        if (aboutData.team) {
            // Replace team title
            template = template.replace(
                /<h2 class="heading-style-h1">Our Expert<br\/>Leadership Team<\/h2>/,
                `<h2 class="heading-style-h1">${aboutData.team.title}</h2>`
            );

            // Replace team description
            template = template.replace(
                /<p class="text-size-regular text-color-white">Our leadership team brings decades of experience in brand management, strategic growth, and market expansion\.<\/p>/,
                `<p class="text-size-regular text-color-white">${aboutData.team.description}</p>`
            );

            // Replace team members if available
            if (aboutData.team.teamMembers && aboutData.team.teamMembers.length > 0) {
                let teamMembersHtml = '';
                aboutData.team.teamMembers.forEach(member => {
                    teamMembersHtml += `
                        <div id="w-node-_5b7c4e99-9693-382c-bde5-b5cce92c1a45-e92c1a45" class="about-team-card">
                            <div id="w-node-_4fc367ca-b062-7098-46a8-94d9420ebfa6-e92c1a45" class="about-team-image">
                                <div class="about-team-height"></div>
                                <div class="image-overlay"></div>
                                <img src="${member.image}" loading="lazy" alt="${member.alt}" class="image-fill" />
                            </div>
                            <div id="w-node-c5faa6d8-8e2c-4d1e-4e85-0b8a77c46c46-e92c1a45" class="home-team-name">
                                <h3 class="heading-style-h3">${member.name}</h3>
                                <div class="home-team-credit">
                                    <p class="text-size-xsmall text-style-allcaps text-color-white text-weight-medium">${member.title}</p>
                                </div>
                            </div>
                        </div>
                    `;
                });

                // Replace the entire team list with the correct structure
                template = template.replace(
                    /<div id="w-node-acc32622-cc3f-1753-2c8a-f316a66e3e75-2c360d96" class="about-team-list">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/,
                    `<div id="w-node-acc32622-cc3f-1753-2c8a-f316a66e3e75-2c360d96" class="about-team-list">
                        ${teamMembersHtml}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>`
                );
            }
        }

        // Replace gallery section
        if (aboutData.gallery && aboutData.gallery.slides && aboutData.gallery.slides.length > 0) {
            let gallerySlides = '';
            aboutData.gallery.slides.forEach((slide, index) => {
                const isActive = index === 1; // Second slide is typically active in the original
                const ariaHidden = index !== 1 ? 'aria-hidden="true"' : '';
                const slideStyle = index !== 1 ? 'style="transition: all, transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94); transform: translateX(-628.323px); opacity: 1;"' : 'style="transition: all, transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94); transform: translateX(-628.323px); opacity: 1;"';
                
                gallerySlides += `
                    <div class="about-image-slide w-slide" aria-label="${index + 1} of ${aboutData.gallery.slides.length}" role="group" ${ariaHidden} ${slideStyle}>
                        <div class="about-slider-image" ${ariaHidden}>
                            <div class="about-slider-height" ${ariaHidden}></div>
                            <div class="image-overlay" ${ariaHidden}></div>
                            <img src="${slide.image}" loading="lazy" 
                                 sizes="(max-width: 479px) 89vw, (max-width: 767px) 93vw, (max-width: 991px) 89vw, 48vw" 
                                 alt="${slide.alt}" class="image-fill" ${ariaHidden}>
                        </div>
                    </div>
                `;
            });

            // Generate slider dots
            let sliderDots = '';
            aboutData.gallery.slides.forEach((_, index) => {
                const isActive = index === 1 ? 'w-active' : '';
                const ariaPressed = index === 1 ? 'true' : 'false';
                const tabIndex = index === 1 ? '0' : '-1';
                
                sliderDots += `<div class="w-slider-dot ${isActive}" data-wf-ignore="" aria-label="Show slide ${index + 1} of ${aboutData.gallery.slides.length}" aria-pressed="${ariaPressed}" role="button" tabindex="${tabIndex}" style="margin-left: 3px; margin-right: 3px;"></div>`;
            });

            // Replace the entire gallery slider
            template = template.replace(
                /<div data-delay="5" data-animation="slide" class="about-slider w-slider"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
                `<div data-delay="5" data-animation="slide" class="about-slider w-slider" data-autoplay="true" data-easing="ease-out-quad" data-hide-arrows="false" data-disable-swipe="false" data-autoplay-limit="1" data-nav-spacing="3" data-duration="700" data-infinite="true" role="region" aria-label="carousel">
                    <div class="about-slider-mask w-slider-mask" id="w-slider-mask-0">
                        ${gallerySlides}
                        <div aria-live="off" aria-atomic="true" class="w-slider-aria-label" data-wf-ignore="">Slide 2 of ${aboutData.gallery.slides.length}.</div>
                    </div>
                    <div class="hide w-slider-nav w-round">
                        ${sliderDots}
                    </div>
                </div>`
            );
        }

        return template;
    } catch (error) {
        console.error('Error in about template replacement:', error);
        return template;
    }
}

module.exports = {
    generateAboutPage,
    getAboutData
};
