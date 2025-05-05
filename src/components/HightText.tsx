import { FC } from 'react';

interface HighlightTextProps {
  text: string;
  highlight: string;
  highlightClassName?: string;
}

const HighlightText: FC<HighlightTextProps> = ({
  text,
  highlight,
  highlightClassName = 'bg-yellow-200',
}) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(
    `(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi'
  );
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className={highlightClassName}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export default HighlightText;
