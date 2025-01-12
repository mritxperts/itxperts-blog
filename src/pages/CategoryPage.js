import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';

const CategoryContainer = styled.div`
  padding: 10px;
  margin: 0 auto;
`;

const CategoryTitle = styled.h1`
  font-size: 36px;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const BlogCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const BlogCard = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }
`;

const BlogCardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const BlogCardContent = styled.div`
  padding: 20px;
`;

const BlogCardTitle = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
`;

const BlogCardExcerpt = styled.p`
  font-size: 16px;
  color: #555;
  line-height: 1.5;
  margin-bottom: 15px;
`;

const ReadMoreLink = styled(Link)`
  color: #0073e6;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const LoadMoreButton = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #0073e6;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #005bb5;
  }
`;

const CategoryPage = () => {
  const { slug } = useParams(); // Get category slug from URL
  const [posts, setPosts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [page, setPage] = useState(1); // Current page number
  const [hasMore, setHasMore] = useState(true); // Whether there are more posts to load

  useEffect(() => {
    // Reset state when category slug changes
    setPosts([]);
    setPage(1);
    setHasMore(true);

    const fetchCategoryData = async () => {
      try {
        const categoryResponse = await axios.get(
          `https://itxperts.co.in/blog/wp-json/wp/v2/categories?slug=${slug}`
        );
        const category = categoryResponse.data[0];

        setCategoryName(category.name);
        fetchPosts(category.id, 1); // Fetch the first page of posts
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };

    fetchCategoryData();
  }, [slug]); // Reset state whenever the category slug changes

  const fetchPosts = async (categoryId, pageNum) => {
    try {
      const response = await axios.get(
        `https://itxperts.co.in/blog/wp-json/wp/v2/posts?categories=${categoryId}&page=${pageNum}&per_page=5`
      );
      const postsData = response.data;

      // Fetch the featured image for each post
      const postsWithImage = await Promise.all(
        postsData.map(async (post) => {
          if (post.featured_media) {
            const mediaResponse = await axios.get(
              `https://itxperts.co.in/blog/wp-json/wp/v2/media/${post.featured_media}`
            );
            post.featured_image_url = mediaResponse.data.source_url;
          }
          return post;
        })
      );

      setPosts((prevPosts) => [...prevPosts, ...postsWithImage]);

      // Check if more posts are available
      if (postsData.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setHasMore(false);
    }
  };

  const handleLoadMore = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      fetchPosts(nextPage);
      return nextPage;
    });
  };

  return (
    <CategoryContainer>
      <CategoryTitle>Posts in {categoryName}</CategoryTitle>
      <BlogCardContainer>
        {posts.length > 0 ? (
          posts.map((post) => (
            <BlogCard key={post.id}>
              {post.featured_image_url ? (
                <BlogCardImage
                  src={post.featured_image_url}
                  alt={post.title.rendered}
                />
              ) : (
                <div style={{ height: '200px', backgroundColor: '#f1f1f1' }}></div>
              )}
              <BlogCardContent>
                <BlogCardTitle>{post.title.rendered}</BlogCardTitle>
                <BlogCardExcerpt
                  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                />
                <ReadMoreLink to={`/post/${post.slug}`}>Read More</ReadMoreLink>
              </BlogCardContent>
            </BlogCard>
          ))
        ) : (
          <p>No posts found in this category.</p>
        )}
      </BlogCardContainer>
      {hasMore && <LoadMoreButton onClick={handleLoadMore}>Load More</LoadMoreButton>}
    </CategoryContainer>
  );
};

export default CategoryPage;
