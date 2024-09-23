import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
} from 'chart.js';
import { FaArrowUp, FaArrowDown, FaTrophy } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { getToken } from '../../Account/userStorageService';
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

const DashboardCards = () => {
  const { t, i18n } = useTranslation();
  const [totalSorties, setTotalSorties] = useState(0);
  const [minSorties, setMinSorties] = useState(null);
  const [maxSorties, setMaxSorties] = useState(null);
  const [threeMonthsData, setThreeMonthsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { 'Accept-Language': i18n.language };
        const totalResponse = await axios.get('http://194.163.173.3:8888/api/admin/total-sorties-current-month', { headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },});
        const minSortiesResponse = await axios.get('http://194.163.173.3:8888/api/admin/min-sorties', { headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },});
        const maxSortiesResponse = await axios.get('http://194.163.173.3:8888/api/admin/max-sorties', { headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        }, });
        const threeMonthsResponse = await axios.get('http://194.163.173.3:8888/api/admin/three-months-sorties', { headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },});
        
        setTotalSorties(totalResponse.data);
        setMinSorties(minSortiesResponse.data);
        setMaxSorties(maxSortiesResponse.data);
        setThreeMonthsData(threeMonthsResponse.data);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language]);

  const chartData = {
    labels: threeMonthsData.map(data => data.month),
    datasets: [
      {
        label: t('total_sorties'),
        data: threeMonthsData.map(data => data.totalSorties),
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: t('total_sorties')
      },
      legend: {
        display: true,
        position: 'bottom'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: t('months')
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: t('total_sorties_mru')
        }
      }
    }
  };

  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;
  }

  const getProductName = (product) => {
    return i18n.language === 'ar' ? product.name_ar : product.name;
  };

  return (
    <Container className="mt-5" dir={direction}>
      <br />
      <Row className="mb-4">
        <Col md={6} lg={4} className="mb-4">
          <Card className="text-white bg-primary h-100">
            <Card.Body>
              <Card.Title className="d-flex align-items-center justify-content-between">
                <span>{t('total_sorties_current_month')}</span>
                <FaTrophy />
              </Card.Title>
              <Card.Text className="display-4">{totalSorties} MRU</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4} className="mb-4">
          <Card className="text-white bg-success h-100">
            <Card.Body>
              <Card.Title className="d-flex align-items-center justify-content-between">
                <span>{t('product_with_max_sorties')}</span>
                <FaArrowUp />
              </Card.Title>
              {maxSorties ? (
                <>
                  <Card.Text className="display-6">{getProductName(maxSorties.product)}</Card.Text>
                  <Card.Text>{t('total_sorties')}: {maxSorties.mouvementCount}</Card.Text>
                </>
              ) : (
                <Card.Text>{t('loading')}</Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4} className="mb-4">
          <Card className="text-white bg-warning h-100">
            <Card.Body>
              <Card.Title className="d-flex align-items-center justify-content-between">
                <span>{t('product_with_min_sorties')}</span>
                <FaArrowDown />
              </Card.Title>
              {minSorties ? (
                <>
                  <Card.Text className="display-6">{getProductName(minSorties.product)}</Card.Text>
                  <Card.Text>{t('total_sorties')}: {minSorties.mouvementCount}</Card.Text>
                </>
              ) : (
                <Card.Text>{t('loading')}</Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="mb-4" style={{ height: '400px' }}>
            <Card.Body>
              <Card.Title>{t('total_sorties')}</Card.Title>
              <div style={{ height: '300px' }}>
                <Line data={chartData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardCards;
