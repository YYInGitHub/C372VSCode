const pool = require('../config/db');

function createPendingBooking(ownerId, petId, serviceId, bookingDate, callback) {
  pool.getConnection((connectionError, connection) => {
    if (connectionError) return callback(connectionError);

    let finished = false;
    const finish = (error, result) => {
      if (finished) return;
      finished = true;

      try {
        connection.release();
      } catch (releaseError) {
        if (error) {
          console.error('Error releasing booking connection:', releaseError);
        } else {
          error = releaseError;
        }
      }

      callback(error, error ? undefined : result);
    };

    connection.beginTransaction((transactionError) => {
      if (transactionError) return finish(transactionError);

      const rollbackAndFinish = (error, result) => {
        connection.rollback((rollbackError) => {
          if (rollbackError) {
            if (error) {
              console.error('Error rolling back booking transaction:', rollbackError);
            } else {
              return finish(rollbackError);
            }
          }
          finish(error, result);
        });
      };

      const bookingSql = `
        INSERT INTO service_bookings
          (pet_id, service_id, booking_status, booked_price, booking_date)
        SELECT pets.id, services.id, 'pending', services.price, ?
        FROM pets
        JOIN services ON services.id = ?
        WHERE pets.id = ? AND pets.owner_id = ? AND services.is_active = 1
      `;

      connection.query(
        bookingSql,
        [bookingDate, serviceId, petId, ownerId],
        (bookingError, bookingResult) => {
          if (bookingError) return rollbackAndFinish(bookingError);
          if (bookingResult.affectedRows === 0) return rollbackAndFinish(null, null);
          if (bookingResult.affectedRows !== 1) {
            return rollbackAndFinish(new Error('Booking insert did not affect exactly one row.'));
          }

          const paymentSql = `
            INSERT INTO payments (booking_id, amount, payment_status)
            SELECT id, booked_price, 'pending'
            FROM service_bookings
            WHERE id = ?
          `;

          connection.query(paymentSql, [bookingResult.insertId], (paymentError, paymentResult) => {
            if (paymentError) return rollbackAndFinish(paymentError);
            if (paymentResult.affectedRows !== 1) {
              return rollbackAndFinish(new Error('Payment insert did not affect exactly one row.'));
            }

            connection.commit((commitError) => {
              if (commitError) return rollbackAndFinish(commitError);
              finish(null, {
                bookingId: bookingResult.insertId,
                paymentId: paymentResult.insertId
              });
            });
          });
        }
      );
    });
  });
}

function getBookingsByOwner(ownerId, callback) {
  const sql = `
    SELECT
      service_bookings.id AS booking_id,
      DATE_FORMAT(service_bookings.booking_date, '%Y-%m-%d') AS booking_date,
      pets.name AS pet_name,
      services.name AS service_name,
      service_bookings.booked_price,
      service_bookings.booking_status,
      payments.payment_status,
      payments.payment_reference,
      service_bookings.created_at
    FROM service_bookings
    JOIN pets ON pets.id = service_bookings.pet_id
    JOIN services ON services.id = service_bookings.service_id
    LEFT JOIN payments ON payments.booking_id = service_bookings.id
    WHERE pets.owner_id = ?
    ORDER BY service_bookings.created_at DESC, service_bookings.id DESC
  `;
  pool.query(sql, [ownerId], callback);
}

module.exports = { createPendingBooking, getBookingsByOwner };
