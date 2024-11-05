import styles from "./page.module.scss";
import Image from "next/image";

interface NewsArticle {
  title: string;
  description: string;
  author: string;
  url: string;
  updated_at: number;
  news_site: string;
  thumb_2x: string;
}

// Fetch articles from CoinGecko API
async function fetchBitcoinNews(): Promise<NewsArticle[]> {
  const res = await fetch("https://api.coingecko.com/api/v3/news", {
    cache: "no-store",
  });
  const jsonData = await res.json();

  const articles = jsonData.data || [];

  const bitcoinNews = articles.filter((article: NewsArticle) => {
    return (
      article.title.includes("Bitcoin") ||
      article.title.includes("btc") ||
      article.description.includes("Bitcoin") ||
      article.description.includes("btc")
    );
  });

  return bitcoinNews as NewsArticle[];
}

// Function to truncate a string to a specified length
const truncateString = (str: string, num: number): string => {
  if (str.length > num) {
    return str.slice(0, num) + "..."; // Add ellipsis if truncated
  }
  return str;
};

export default async function HomePage() {
  const newsArticles = await fetchBitcoinNews();

  return (
    <div className={styles.articleContainer}>
      <p>Your go-to source for the latest Bitcoin news.</p>
      <div className={styles.articles}>
        {newsArticles.length > 0 ? (
          newsArticles.map((article) => (
            <div key={article.url} className={styles.articleCard}>
              <div>
                <h2>{article.title}</h2>
              </div>
              <div>
                <div className={styles.imagePlaceholder}>
                  {article.thumb_2x && article.thumb_2x !== "missing_large.png" ? (
                    <Image src={article.thumb_2x} alt={article.title} width={1920} height={1080} />
                  ) : (
                    <div className={styles.noImage}>No picture available.</div>
                  )}
                </div>
                <p>{truncateString(article.description, 300)}</p> {/* Limit to 300 characters */}
                <h4>
                  <strong>Author:</strong> <span>{article.author}</span>
                </h4>
                <h4>
                  <strong>Source:</strong> <span>{article.news_site}</span>
                </h4>
                <h4>
                  <strong>Published:</strong>{" "}
                  <span>{new Date(article.updated_at * 1000).toLocaleDateString()}</span>
                </h4>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  Read More
                </a>
              </div>
            </div>
          ))
        ) : (
          <p>No articles available at this time.</p>
        )}
      </div>
    </div>
  );
}
