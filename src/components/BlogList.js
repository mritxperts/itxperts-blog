import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BlogCard from './BlogCard';
import styled from 'styled-components';
import { FaCode, FaMobileAlt, FaSearch, FaCloud } from 'react-icons/fa'; // Importing icons
import AdSenseAd from './AdSenseAd';
// Main container for the blog list
const BlogListContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* Default: single column for mobile-first */
  gap: 20px;
  padding: 20px;

  @media (min-width: 768px) {
    grid-template-columns: 3fr 1fr; /* Latest Posts section larger, Services section smaller */
  }
`;

// Services Section Styles
const ServicesSection = styled.div`
  background-color: #f4f4f4;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Grid layout for services */
  gap: 20px;
`;

const ServiceCard = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  svg {
    font-size: 40px;
    color: #0073e6;
    margin-bottom: 15px;
  }
`;

const ServiceTitle = styled.h4`
  margin: 10px 0;
  color: #333;
`;

const ServiceDescription = styled.p`
  color: #555;
  font-size: 16px;
`;

// Latest Posts Section Styles
const LatestPostsSection = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

// Category Section Styles
const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 0 16px;
`;

const CategoryName = styled.h2`
  margin: 0;
`;

const ViewMoreLink = styled(Link)`
  color: #0073e6;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const BlogList = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [categoryPosts, setCategoryPosts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the latest 5 posts
        const latestResponse = await axios.get(
          'https://itxperts.co.in/blog/wp-json/wp/v2/posts?per_page=5'
        );
        setLatestPosts(latestResponse.data);

        // Fetch categories
        const categoriesResponse = await axios.get(
          'https://itxperts.co.in/blog/wp-json/wp/v2/categories'
        );
        const categories = categoriesResponse.data;

        // Fetch 5 posts for each category
        const categoryPostsData = {};
        for (const category of categories) {
          const postsResponse = await axios.get(
            `https://itxperts.co.in/blog/wp-json/wp/v2/posts?categories=${category.id}&per_page=5`
          );
          categoryPostsData[category.slug] = { 
            name: category.name, 
            posts: postsResponse.data 
          };
        }
        setCategoryPosts(categoryPostsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <BlogListContainer>
        {/* Left Section: Latest Posts (Larger Section) */}
        <LatestPostsSection>
          <h2>Latest Posts</h2>
          {latestPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </LatestPostsSection>

        {/* Right Section: Itxperts Services (Smaller Section) */}
        <ServicesSection>
          <ServiceCard>
            <FaCode />
            <ServiceTitle>Web Design & Development</ServiceTitle>
            <ServiceDescription>
              We create custom websites to cater to your business needs, ensuring a responsive and user-friendly experience.
            </ServiceDescription>
          </ServiceCard>

          <ServiceCard>
            <FaMobileAlt />
            <ServiceTitle>Mobile App Development</ServiceTitle>
            <ServiceDescription>
              Our mobile app development services help you create applications for Android and iOS with high-performance features.
            </ServiceDescription>
          </ServiceCard>

          <ServiceCard>
            <FaSearch />
            <ServiceTitle>SEO Services</ServiceTitle>
            <ServiceDescription>
              Boost your search engine rankings and drive traffic to your website with our expert SEO strategies.
            </ServiceDescription>
          </ServiceCard>

          <ServiceCard>
            <FaCloud />
            <ServiceTitle>Cloud Solutions</ServiceTitle>
            <ServiceDescription>
              We provide robust cloud-based solutions to help you scale your business efficiently and securely.
            </ServiceDescription>
          </ServiceCard>
        </ServicesSection>
      </BlogListContainer>
      {/* Add AdSense Ad */}
      <AdSenseAd client="ca-pub-1668326870639724" slot="7338125119" />
      {/* Posts by Category */}
      {Object.keys(categoryPosts).map((categorySlug) => {
        const category = categoryPosts[categorySlug];
        return (
          <div key={categorySlug}>
            <CategoryHeader>
              <CategoryName>{category.name}</CategoryName>
              <ViewMoreLink to={`/category/${categorySlug}`}>View More</ViewMoreLink>
            </CategoryHeader>
            {category.posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default BlogList;
