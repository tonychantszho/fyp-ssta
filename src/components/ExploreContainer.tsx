import './ExploreContainer.css';
import Tesseract, { createWorker } from 'tesseract.js';
import { useEffect } from 'react';

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {

  useEffect(() => {

    const init = async () => {
      const worker = await createWorker({
        logger: m => console.log(m)
      });

      await worker.load();
      await worker.loadLanguage('chi_tra');
      await worker.initialize('chi_tra');
      const { data } = await worker.recognize('https://i.imgur.com/Uho3NVq.jpeg');
      console.log(data.lines);
      await worker.terminate();
    };

    init();

  }, []);

  return (
    <div className="container">
      higgsrgwegfgfhgfgd
    </div>
  );
};

export default ExploreContainer;
