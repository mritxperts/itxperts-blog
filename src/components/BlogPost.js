import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaRegFileAlt, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa'; // Importing icons
import AdSenseAd from './AdSenseAd';

const BlogPostContainer = styled.div`
  display: flex;
  gap: 30px;
  padding: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  flex: 1;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
  position: sticky;
  top: 20px;
  @media (max-width: 768px) {
    width: 100%;
    margin-top: 20px;
  }
`;

const PostTitleList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const PostTitleItem = styled.li`
  margin-bottom: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;

  a {
    text-decoration: none;
    color: #0073e6;
    font-weight: bold;
    margin-left: 10px;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const PostMetadata = styled.div`
  margin: 15px 0;
  font-size: 14px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
`;

const ShareIcons = styled.div`
  display: flex;
  gap: 10px;

  a {
    color: #555;
    transition: color 0.3s;

    &:hover {
      color: #0073e6;
    }

    svg {
      font-size: 20px;
    }
  }
`;

const BlogPost = () => {
  const { slug } = useParams(); // Get the post slug from the URL
  const [post, setPost] = useState(null);
  const [categoryPosts, setCategoryPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        // Fetch the current post with _embed to get author details
        const postResponse = await axios.get(
          `https://itxperts.co.in/blog/wp-json/wp/v2/posts?slug=${slug}&_embed=true`
        );
        setPost(postResponse.data[0]); // Since the response returns an array

        // Fetch posts from the same category
        const categoryId = postResponse.data[0].categories[0]; // Assuming the post belongs to one category
        const categoryPostsResponse = await axios.get(
          `https://itxperts.co.in/blog/wp-json/wp/v2/posts?categories=${categoryId}`
        );
        setCategoryPosts(categoryPostsResponse.data);
      } catch (error) {
        console.error('Error fetching post or category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [slug]); // Using slug as dependency

  if (loading) {
    return <p>Loading...</p>;
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const author = post._embedded?.author?.[0]?.name || 'Unknown Author';

  return (
    <BlogPostContainer>
      {/* Main Content */}
      <MainContent>
        <h1>{post.title.rendered}</h1>

        {/* Author, Date/Time, and Share Icons */}
        <PostMetadata>
          <span>By {author}</span>
          <span>{formattedDate}</span>
          <ShareIcons>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?url=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
            >
              <FaWhatsapp />
            </a>
          </ShareIcons>
        </PostMetadata>

        <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
        {/* Add AdSense Ad */}
        <AdSenseAd client="ca-pub-1668326870639724" slot="7338125119" />
      </MainContent>

      {/* Sidebar */}
      <Sidebar>
        <h3>More Posts in this Category</h3>
        <PostTitleList>
          {categoryPosts.map((postItem) => (
            <PostTitleItem key={postItem.id}>
              <FaRegFileAlt size={20} /> {/* Icon for each post */}
              <Link to={`/post/${postItem.slug}`}>{postItem.title.rendered}</Link> {/* Using Link instead of a */}
            </PostTitleItem>
          ))}
        </PostTitleList>
      </Sidebar>
    </BlogPostContainer>
  );
};

export default BlogPost;
