import React, { Component } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Dropdown } from "react-bootstrap";
import styles from "../styles/feed.module.css";

import { server } from "../config";
import { changeDataUser } from "../redux/feed-user-slice";
import { hideLoading, showLoading } from "../redux/loading-slice";
import { setHasMore } from "../redux/has-more-slice";
import { setDataFeed } from "../redux/feed-data-slice";
import ApplyButton from "./ApplyButton";
import { feedLimit } from "../constants/constants";

const FilterDateButton = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.dataUser.value);
  // console.log("FilterDateButton render user=", user);
  const filters = [
    { val: "0", name: "Todas", id: "filter0", data: "filter0" },
    { val: "1", name: "Só hoje", id: "filter1", data: "filter1" },
    { val: "2", name: "Só ontem", id: "filter2", data: "filter2" },
    { val: "3", name: "Últimos 7 dias", id: "filter3", data: "filter3" },
    { val: "4", name: "Últimos 30 dias", id: "filter4", data: "filter4" },
    { val: "5", name: "Últimos 3 meses", id: "filter5", data: "filter5" },
    { val: "6", name: "Últimos 6 meses", id: "filter6", data: "filter6" },
  ];

  function toogleRadio(el) {
    // console.log("toogleRadio", el.target.dataset.value, user.timeFilter, el);
    dispatch(
      changeDataUser([
        "timeFilter",
        el.target.dataset.value ? el.target.dataset.value : "0",
      ])
    );
    // console.log("toogleRadio depois", el.target.dataset.value, user.timeFilter);
  }

  const onToggle = (a, el) => {
    // console.log();
    // console.log("onToggle", a, el.originalEvent.target, user.timeFilterOpen);
    // console.log();
    // if (el.originalEvent)
    //   if (el.originalEvent.target)
    //     if (el.originalEvent.target.type)
    //       if (el.originalEvent.target.type === "submit") {
    //         console.log("=====================================");
    //         return;
    //       }
    dispatch(changeDataUser(["timeFilterOpen", !user.timeFilterOpen]));
    dispatch(changeDataUser(["filterOpen", false]));
    dispatch(changeDataUser(["filterIdolOpen", false]));
  };

  const saveFilter = (el) => {
    el.preventDefault();
    const newValue = user.timeFilter ? user.timeFilter : "0";
    dispatch(changeDataUser(["timeFilterOpen", false]));
    if (newValue === user.timeFilterApplied) {
      // console.log("there were no changes ====================================");
      return;
    }
    dispatch(changeDataUser(["timeFilterApplied", newValue]));

    // show loading message / spinning
    dispatch(showLoading());

    const filterText = "";
    switch (user.timeFilter) {
      case "0":
        filterText = "Mostrando todas";
        break;
      case "1":
        filterText = "Mostrando somente hoje";
        break;
      case "2":
        filterText = "Mostrando somente ontem";
        break;
      case "3":
        filterText = "Mostrando últimos 7 dias";
        break;
      case "4":
        filterText = "Mostrando últimos 30 dias";
        break;
      case "5":
        filterText = "Mostrando últimos 3 meses";
        break;
      case "6":
        filterText = "Mostrando últimos 6 meses";
        break;
    }
    dispatch(changeDataUser(["timeFilterText", filterText]));

    fetch(`${server}/feeds/timeFilter/`, {
      method: "POST",
      body: JSON.stringify({ filter: newValue }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => {
        dispatch(hideLoading());
        if (json.error === -1) {
          // houver erro - logout or timeout - need to login
          router.push("/login?timeout=true");
          return;
        }
        dispatch(setDataFeed(json.list));
        
        if (json.list < feedLimit) dispatch(setHasMore(false));
        else dispatch(setHasMore(true));
      });
  };

  function loadFilter(e) {
    // console.log(
    //   "===============  loadFilter",
    //   user.timeFilterOpen,
    //   user.timeFilterApplied,
    //   user.timeFilter
    // );
    // load the filter back only if the dropdown is closed --> when user click the button to open it and change the filter
    if (user.timeFilterOpen) return;
    dispatch(changeDataUser(["timeFilter", user.timeFilterApplied]));
  }

  return (
    <>
      <div className="text-center">
        <Dropdown
          show={user.timeFilterOpen}
          onToggle={onToggle}
          autoClose="outside"
          onClick={loadFilter}
        >
          <Dropdown.Toggle
            variant="warning"
            id="dropdown-basic"
            className="blue fw-bold"
          >
            Filtrar por Data
          </Dropdown.Toggle>

          <Dropdown.Menu className={styles.dropdownMenu}>
            {filters.map((e) => (
              <Dropdown.Item
                onClick={toogleRadio}
                key={e.val}
                data-value={e.val}
              >
                <div className="form-check" data-value={e.val}>
                  <input
                  id={"filterDate" + e.val}
                    className="form-check-input form-check-input-sm"
                    type="radio"
                    name="filter"
                    data-value={e.val}
                    checked={user.timeFilter === e.val}
                    onChange={toogleRadio}
                  />
                  <label for={"filterDate" + e.val} className="form-check-label" data-value={e.val}>
                    {e.name}
                  </label>
                </div>
              </Dropdown.Item>
            ))}
            <Dropdown.Item>
              <ApplyButton action={saveFilter} />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {user.timeFilter === "0" ? (
          <p>{user.timeFilterText}</p>
        ) : (
          <p className="red">{user.timeFilterText}</p>
        )}
      </div>
      <style jsx>{`
        .dropdown-menu {
          background-color: black;
        }
      `}</style>
    </>
  );
};

export default FilterDateButton;
