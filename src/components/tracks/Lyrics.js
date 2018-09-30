import React, { Component } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "../layout/spinner";
import Moment from "react-moment";

class Lyrics extends Component {
  state = {
    track: {},
    lyrics: {}
  };

  componentDidMount() {
    Axios.get(
      `https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${
        this.props.match.params.id
      }&apikey=${process.env.REACT_APP_MM_KEY}`
    )
      .then(res => {
        console.log(res.data);
        this.setState({ lyrics: res.data.message.body.lyrics });
        return Axios.get(
          `https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.get?track_id=${
            this.props.match.params.id
          }&apikey=${process.env.REACT_APP_MM_KEY}`
        )
          .then(res => {
            // console.log(res.data);
            this.setState({ track: res.data.message.body.track });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  render() {
    const { track, lyrics } = this.state;
    console.log(track);
    let genre = "";
    if (
      track === undefined ||
      lyrics === undefined ||
      Object.keys(track).length === 0 ||
      Object.keys(lyrics).length === 0
    ) {
      return <Spinner />;
    } else {
      if (!track.primary_genres.music_genre_list[0]) {
        genre = "Genre not listed";
      } else {
        genre =
          track.primary_genres.music_genre_list[0].music_genre.music_genre_name;
      }
      return (
        <React.Fragment>
          <Link to="/" className="btn btn-dark btn-sm mb-4">
            Go Back
          </Link>
          <div className="card">
            <h5 className="card-header">
              {track.track_name} by{" "}
              <span className="text-secondary">{track.artist_name}</span>
            </h5>
            <div className="card-body">
              <p className="card-text">{lyrics.lyrics_body}</p>
            </div>
          </div>

          <ul className="list-group mt-3">
            <li className="list-group-item">
              <strong>Album ID</strong>: {track.album_id}
            </li>
            <li className="list-group-item">
              <strong>Music Genre</strong>: {genre}
            </li>
            <li className="list-group-item">
              <strong>Explicit</strong>: {track.explicit === 0 ? "No" : "Yes"}
            </li>
            <li className="list-group-item">
              <strong>Release Date</strong>:{" "}
              <Moment format="MM/DD/YYYY">{track.first_release_date}</Moment>
            </li>
          </ul>
        </React.Fragment>
      );
    }
  }
}

export default Lyrics;
