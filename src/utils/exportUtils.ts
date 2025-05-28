import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export const exportDocx = async (title: string, content: string) => {
  try {
    // Create a new Document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: parseHtmlToDocx(content),
        },
      ],
    });

    // Generate the .docx file
    const buffer = await Packer.toBuffer(doc);
    
    // Create a Blob from the buffer
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    
    // Create a download link for the blob
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title || 'Untitled'}.docx`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error exporting to DOCX:', error);
    throw new Error('Failed to export document');
  }
};

// Simple HTML parser for DOCX conversion
const parseHtmlToDocx = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const elements = doc.body.children;
  
  const paragraphs: Paragraph[] = [];
  
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    
    if (element.tagName === 'H1') {
      paragraphs.push(new Paragraph({
        text: element.textContent || '',
        heading: HeadingLevel.HEADING_1,
      }));
    } else if (element.tagName === 'H2') {
      paragraphs.push(new Paragraph({
        text: element.textContent || '',
        heading: HeadingLevel.HEADING_2,
      }));
    } else if (element.tagName === 'H3') {
      paragraphs.push(new Paragraph({
        text: element.textContent || '',
        heading: HeadingLevel.HEADING_3,
      }));
    } else if (element.tagName === 'P') {
      paragraphs.push(new Paragraph({
        children: [new TextRun(element.textContent || '')],
      }));
    } else if (element.tagName === 'UL') {
      const items = element.getElementsByTagName('LI');
      for (let j = 0; j < items.length; j++) {
        paragraphs.push(new Paragraph({
          text: `• ${items[j].textContent || ''}`,
        }));
      }
    } else if (element.tagName === 'OL') {
      const items = element.getElementsByTagName('LI');
      for (let j = 0; j < items.length; j++) {
        paragraphs.push(new Paragraph({
          text: `${j + 1}. ${items[j].textContent || ''}`,
        }));
      }
    } else {
      // Default to paragraph for other elements
      paragraphs.push(new Paragraph({
        text: element.textContent || '',
      }));
    }
  }
  
  return paragraphs;
};