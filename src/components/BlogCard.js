import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 16px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;
const ReadMoreLink = styled(Link)`
  color: #0073e6;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const BlogCard = ({ post }) => {
  return (
    <Card>
      <h2>{post.title.rendered}</h2>
      <p dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}></p>
      <ReadMoreLink to={`/post/${post.slug}`}>Read More</ReadMoreLink>
    </Card>
  );
};

export default BlogCard;
